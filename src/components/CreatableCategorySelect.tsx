"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Check, ChevronDown, X, Sparkles } from "lucide-react";

export interface CategoryOption {
  id: string;
  name: string;
}

interface CreatableCategorySelectProps {
  value: string; // The category slug/id
  categoryName?: string; // The category display name
  categories: CategoryOption[];
  onChange: (category: { id: string; name: string }) => void;
  onAddCategory?: (category: { id: string; name: string }) => void;
  toSlug?: (text: string) => string;
  className?: string;
}

function defaultToSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreatableCategorySelect({
  value,
  categoryName,
  categories,
  onChange,
  onAddCategory,
  toSlug = defaultToSlug,
  className = "",
}: CreatableCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tìm tên hiển thị hiện tại
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === value);
  }, [categories, value]);

  const currentDisplayName = categoryName || currentCategory?.name || value || "";

  // Giá trị trong ô gõ
  const [inputValue, setInputValue] = useState(currentDisplayName);

  // Đồng bộ inputValue khi selection từ ngoài thay đổi và dropdown đang đóng
  useEffect(() => {
    if (!isOpen) {
      setInputValue(currentDisplayName);
    }
  }, [currentDisplayName, isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setInputValue(currentDisplayName);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, currentDisplayName]);

  // Lọc danh sách chuyên mục theo chuỗi người dùng gõ
  const filteredCategories = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [categories, inputValue]);

  // Kiểm tra xem chuỗi đang gõ có khớp chính xác với chuyên mục nào chưa
  const exactMatchedCategory = useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return null;
    return categories.find(
      (c) =>
        c.name.toLowerCase() === trimmed ||
        c.id.toLowerCase() === trimmed
    );
  }, [categories, inputValue]);

  const canCreateNew = inputValue.trim().length > 0 && !exactMatchedCategory;

  const handleSelect = (cat: CategoryOption) => {
    onChange(cat);
    setInputValue(cat.name);
    setIsOpen(false);
  };

  const handleCreateNew = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const slug = toSlug(trimmed) || `cat-${Date.now()}`;
    const newCategory: CategoryOption = { id: slug, name: trimmed };

    if (onAddCategory) {
      onAddCategory(newCategory);
    }
    onChange(newCategory);
    setInputValue(trimmed);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn submit form bài viết
      if (canCreateNew) {
        handleCreateNew(inputValue);
      } else if (filteredCategories.length > 0) {
        handleSelect(filteredCategories[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue(currentDisplayName);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Combobox Input */}
      <div
        className={`w-full flex items-center rounded-[3px] bg-white border text-xs transition-all ${
          isOpen
            ? "border-[#ed3237] ring-1 ring-[#ed3237]/25 shadow-2xs"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onFocus={() => {
            setIsOpen(true);
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Chọn hoặc gõ tên chuyên mục..."
          className="w-full px-3 py-2 bg-transparent text-slate-800 text-xs focus:outline-none placeholder:text-slate-400"
        />

        <div className="flex items-center pr-2 gap-1 shrink-0">
          {inputValue && isOpen && inputValue !== currentDisplayName && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
              title="Xóa chữ"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              if (!isOpen) {
                inputRef.current?.focus();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Đóng / mở danh sách"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#ed3237]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-[3px] shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Nút bấm Tạo mới chuyên mục khi gõ tên chưa tồn tại */}
          {canCreateNew && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCreateNew(inputValue);
              }}
              className="w-full px-3 py-2.5 text-left text-xs font-semibold text-[#ed3237] bg-red-50/70 hover:bg-red-100/80 border-b border-red-100 flex items-center gap-2 transition-colors cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-[3px] bg-[#ed3237] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1 truncate">
                <span>Thêm chuyên mục mới: </span>
                <span className="font-bold underline">"{inputValue.trim()}"</span>
              </div>
            </button>
          )}

          {/* Danh sách chuyên mục hiện có */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 py-0.5">
            {filteredCategories.length === 0 && !canCreateNew ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                Không tìm thấy chuyên mục nào phù hợp
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = cat.id === value;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(cat);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-red-50/70 font-bold text-[#ed3237]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isSelected ? "bg-[#ed3237]" : "bg-slate-300"
                        }`}
                      />
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        ({cat.id})
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#ed3237] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Thanh hướng dẫn nhỏ chân dropdown */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Gõ để lọc hoặc thêm mới</span>
            <span>Nhấn <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-600">Enter</kbd> để chọn</span>
          </div>
        </div>
      )}
    </div>
  );
}
