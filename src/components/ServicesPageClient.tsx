"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Mountain,
  Route,
  Building2,
  Compass,
  Layers,
  Wrench,
  Factory,
} from "lucide-react";
import { CompanySettings } from "@/types";

interface ServicesPageClientProps {
  settings: CompanySettings;
}

interface ServiceDetail {
  id: string;
  tag: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  iconName: string;
  techHighlights: string[];
  equipmentList: string[];
}

export default function ServicesPageClient({ settings }: ServicesPageClientProps) {
  const servicesData: ServiceDetail[] = [
    {
      id: "ham-xuyen-nui",
      tag: "NĂNG LỰC ĐỘT PHÁ",
      title: "Thi Công Hầm Đường Bộ & Hầm Xuyên Núi",
      shortDesc: "Đơn vị tổng thầu thi công hầm đường bộ hàng đầu Việt Nam, làm chủ công nghệ đào hầm NATM tiên tiến của Áo.",
      fullDesc:
        "Với bề dày kinh nghiệm và đội ngũ chuyên gia đào hầm kỳ cựu, Trung Hải JSC tự hào là đơn vị tiên phong tham gia khoan đào và hoàn thiện những cung hầm đường bộ xuyên núi hiểm trở nhất miền Trung. Chúng tôi kiểm soát tuyệt đối an toàn địa chất bằng quy trình trắc đạc đo chuyển vị chính xác đến từng milimet và thi công chống đỡ tức thời.",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
      iconName: "mountain",
      techHighlights: [
        "Phương pháp NATM (New Austrian Tunnelling Method) chuẩn quốc tế",
        "Kỹ thuật khoan nổ mịn (Smooth Blasting) hạn chế rung chấn tầng đá xung quanh",
        "Hệ vì kèo thép vòm I, neo đá Swellex và phun vữa bê tông gia cố chịu lực cao",
        "Thi công vỏ hầm vĩnh cửu bằng ván khuôn hầm thủy lực liên tục",
        "Hệ thống thông gió phản lực, thoát hiểm, PCCC và chiếu sáng hầm thông minh",
      ],
      equipmentList: [
        "Máy khoan hầm Jumbo 2 cần - 3 cần điều khiển thủy lực tự động (Atlas Copco / Sandvik)",
        "Robot phun bê tông ướt công suất lớn chuyên dụng cho hầm",
        "Xe xúc lật ngầm gầu lớn và xe tải chuyên dụng vận chuyển đá hầm",
        "Hệ thống quạt thông gió công nghiệp cưỡng bức đường kính 2.2m",
      ],
    },
    {
      id: "duong-cao-toc",
      tag: "HUYẾT MẠCH GIAO THÔNG",
      title: "Thi Công Đường Cao Tốc & Quốc Lộ Trọng Điểm",
      shortDesc: "Thi công nền mặt đường bê tông nhựa Polymer, giải tỏa áp lực giao thông trên các trục huyết mạch quốc gia.",
      fullDesc:
        "Trung Hải JSC tham gia thi công các gói thầu hạ tầng giao thông quy mô lớn trên tuyến Cao tốc Bắc - Nam và các đoạn huyết mạch Quốc lộ 1. Với dây chuyền trải thảm tự động hiện đại và quy trình kiểm soát chất lượng khắt khe, chúng tôi mang đến những cung đường êm thuận, thoát nước tối ưu và tuổi thọ vận hành bền vững.",
      image: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
      iconName: "route",
      techHighlights: [
        "Thảm bê tông nhựa Polyme cải tiến chịu tải trọng trục siêu nặng và nhiệt độ cao",
        "Công nghệ cào bóc tái sinh nguội (Cold Recycling) mặt đường bảo vệ môi trường",
        "Xử lý nền đất yếu bằng cọc cát đầm chặt, bấc thấm gia tải và vải địa kỹ thuật cường độ cao",
        "Đúc dải phân cách bê tông khuôn trượt liên tục (Slipform Paver)",
        "Hoàn thiện hệ thống an toàn giao thông: Biển báo phản quang 3M, vạch sơn nhiệt dẻo phản quang",
      ],
      equipmentList: [
        "Trạm trộn bê tông nhựa nóng công suất 160 - 240 tấn/giờ điều khiển tự động",
        "Máy rải thảm chuyên dụng Vogele có hệ thống cảm biến cao độ siêu âm",
        "Dàn lu rung bánh thép kép Hamm, lu lốp phối hợp kiểm soát độ chặt K98",
        "Thiết bị đo độ bằng phẳng mặt đường laser tự động",
      ],
    },
    {
      id: "cau-can-vuot-song",
      tag: "KẾT CẤU CHÍNH XÁC",
      title: "Xây Dựng Cầu Cạn, Cầu Vượt Sông & Nút Giao Phức Tạp",
      shortDesc: "Thi công kết cấu dầm Super T bê tông dự ứng lực, móng cọc khoan nhồi sâu và cầu đúc hẫng cân bằng khẩu độ lớn.",
      fullDesc:
        "Chúng tôi sở hữu năng lực toàn diện trong việc thi công các công trình cầu cạn trên cao tốc, cầu vượt sông lớn với độ tĩnh không cao. Từ các trụ tháp sừng sững cắm sâu vào tầng đá lòng sông đến các nhịp dầm đúc hẫng vươn dài, mỗi công trình đều là sự kết tinh giữa kỷ luật công nghệ và tinh thần vượt khó của người kỹ sư Trung Hải.",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80",
      iconName: "compass",
      techHighlights: [
        "Khoan cọc nhồi đường kính lớn D1500 - D2000mm ngàm sâu trong đá gốc dưới lòng nước",
        "Thi công đúc hẫng cân bằng (Cast-in-place Balanced Cantilever) khẩu độ nhịp hơn 120m",
        "Sản xuất và lao lắp dầm Super T, dầm I bê tông dự ứng lực nhịp 33m - 40m",
        "Kiểm soát chính xác lực căng cáp dự ứng lực và độ vồng dầm bằng cảm biến thủy lực kỹ thuật số",
        "Chống thấm bản mặt cầu và lắp khe co giãn răng lược biên độ co giãn lớn",
      ],
      equipmentList: [
        "Dàn khoan cọc nhồi xoay thủy lực Bauer / Sany lực xoắn lớn",
        "Giá long môn lao dầm tải trọng 120 - 180 tấn",
        "Hệ thống xe đúc hẫng di động hiện đại",
        "Cần cẩu bánh xích tải trọng từ 80 đến 250 tấn",
      ],
    },
    {
      id: "dia-ky-thuat-mai-doc",
      tag: "AN TOÀN BỀN VỮNG",
      title: "Gia Cố Mái Dốc, Neo Đất Đá & Xử Lý Sạt Trượt Đèo Núi",
      shortDesc: "Ứng dụng các giải pháp địa kỹ thuật chuyên sâu để bảo vệ an toàn cho các tuyến giao thông huyết mạch qua đèo hiểm trở.",
      fullDesc:
        "Những cung đường đèo núi miền Trung thường xuyên đối mặt với nguy cơ sạt lở dữ dội trong mùa mưa lũ. Trung Hải JSC là đơn vị có bề dày thực chiến trong việc xử lý các vị trí sạt trượt nguy hiểm, khoan neo đá sâu, giằng cáp dự ứng lực và phun vữa bảo vệ mái dốc taluy, giữ vững mạch máu giao thông an toàn tuyệt đối.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      iconName: "layers",
      techHighlights: [
        "Khoan neo thanh thép cường độ cao và neo cáp dự ứng lực sâu 15m - 30m trong tầng đá",
        "Phun vữa bê tông gia cố (Shotcrete) cốt sợi thép bảo vệ bề mặt chống phong hóa",
        "Hệ thống lưới thép cường độ cao (Tecco/Rockfall Barrier) ngăn đá lăn đá rơi",
        "Xây dựng tường chắn đất có cốt (MSE Wall), rọ đá liên hoàn thoát nước áp lực âm",
        "Hệ thống rãnh đỉnh, bậc dốc thoát lũ ngăn chặn xói mòn chân cơ mái taluy",
      ],
      equipmentList: [
        "Máy khoan đập đáy và máy khoan neo chuyên dụng trên địa hình dốc đứng",
        "Bơm vữa áp lực cao kiểm soát dung dịch vữa trương nở không co ngót",
        "Máy phun vữa khô/ướt áp lực khí nén Aliva",
        "Dàn giáo treo và sàn thao tác an toàn cơ động cao",
      ],
    },
    {
      id: "ha-tang-do-thi-kcn",
      tag: "QUY MÔ ĐỒNG BỘ",
      title: "Hạ Tầng Kỹ Thuật Đô Thị & Khu Công Nghiệp",
      shortDesc: "Thi công san lấp mặt bằng, hệ thống thoát nước ngầm, giao thông nội khu và các công trình ngầm hạ tầng.",
      fullDesc:
        "Chúng tôi mang đến giải pháp tổng thể cho hạ tầng kỹ thuật các khu công nghiệp, khu chế xuất và khu đô thị mới. Bằng việc sở hữu đội xe máy xúc đào, ủi, lu đông đảo, Trung Hải bảo đảm hoàn thành tiến độ san lấp mặt bằng hàng triệu mét khối và hạ ngầm đồng bộ hệ thống cấp thoát nước, điện chiếu sáng đúng cam kết chất lượng.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      iconName: "wrench",
      techHighlights: [
        "San lấp mặt bằng diện tích lớn với trắc đạc GPS định vị cao độ chính xác",
        "Lắp đặt cống hộp bê tông cốt thép đúc sẵn khẩu độ lớn chịu tải xe container",
        "Mạng lưới cấp nước cứu hỏa và thoát nước mưa - nước thải tách riêng",
        "Thảm bê tông nhựa hoặc đổ bê tông xi măng đường trục chính và nhánh nội bộ KCN",
        "Trạm xử lý nước thải công nghiệp tập trung đạt chuẩn xả thải môi trường",
      ],
      equipmentList: [
        "Đoàn xe ủi công suất lớn D6, D85 và máy đào gầu 0.9 - 1.6 m3",
        "Xe lu rung 16 - 25 tấn bảo đảm độ chặt nền móng",
        "Cần cẩu tự hành lắp đặt cống hộp khẩu độ nặng",
        "Trạm nghiền sàng đá và trạm trộn bê tông xi măng thương phẩm",
      ],
    },
    {
      id: "dan-dung-nha-xuong",
      tag: "KẾT CẤU BỀN VỮNG",
      title: "Xây Dựng Dân Dụng & Nhà Xưởng Kết Cấu Thép",
      shortDesc: "Gia công lắp dựng khung thép tiền chế khẩu độ lớn, nhà xưởng kho vận logistics và công trình nhà điều hành.",
      fullDesc:
        "Bên cạnh lĩnh vực giao thông hạ tầng, Trung Hải phát triển mạnh mảng xây dựng dân dụng kỹ thuật và nhà xưởng công nghiệp quy mô lớn. Với năng lực chế tạo cấu kiện thép chuẩn mực và biện pháp thi công lắp dựng khoa học, các công trình nhà máy luôn đạt tối ưu về tiến độ, thẩm mỹ và an toàn chịu lực.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
      iconName: "building",
      techHighlights: [
        "Khung nhà thép tiền chế vượt nhịp lớn (khẩu độ trên 45m không cột giữa)",
        "Sàn bê tông công nghiệp phủ hardener / mài bóng epoxy chịu tải trọng cơ giới nặng",
        "Vách panel cách âm cách nhiệt chống cháy lan đạt chuẩn kiểm định PCCC",
        "Mái lợp seamlock chống bão, hệ thống cửa trời lấy sáng và thông gió đối lưu tự nhiên",
        "Hệ thống cơ điện MEP, trạm biến áp và hệ thống tiếp địa an toàn",
      ],
      equipmentList: [
        "Dàn cẩu xích và cẩu bánh lốp lắp dựng khung giàn thép tải trọng 25 - 50 tấn",
        "Máy xoa nền bê tông đôi laser điều khiển từ xa",
        "Máy cắt, chấn, hàn tự động công nghệ cao gia công kết cấu",
        "Xe nâng người cắt kéo thi công trên cao an toàn",
      ],
    },
  ];

  const getServiceIcon = (name: string) => {
    switch (name) {
      case "mountain":
        return <Mountain className="w-5 h-5" />;
      case "route":
        return <Route className="w-5 h-5" />;
      case "compass":
        return <Compass className="w-5 h-5" />;
      case "layers":
        return <Layers className="w-5 h-5" />;
      case "wrench":
        return <Wrench className="w-5 h-5" />;
      case "building":
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="flex items-center gap-1 text-slate-600 hover:text-[#ed3237] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-[#ed3237] font-semibold">Lĩnh vực hoạt động</li>
          </ol>
        </nav>

        {/* Page Title Header */}
        <div className="pb-6 border-b border-slate-200 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-red-50 border border-red-200/80 text-[#ed3237] text-xs font-bold uppercase tracking-wider mb-2.5">
            <HardHat className="w-3.5 h-3.5" />
            <span>Năng lực cốt lõi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            LĨNH VỰC HOẠT ĐỘNG
          </h1>
        </div>

        {/* Main Services Deep-Dive Listing */}
        <div className="space-y-10">
          {servicesData.map((service, index) => {
            const isReversed = index % 2 === 1;

            return (
              <article
                key={service.id}
                id={service.id}
                className="bg-white rounded-[3px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Visual / Image Side (5 cols) */}
                  <div
                    className={`lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full overflow-hidden bg-slate-100 ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Top Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-[#3e4095] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-[3px] shadow">
                        {service.tag}
                      </span>
                    </div>

                    {/* Bottom Image Overlay Details */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-[3px] bg-[#ed3237] text-white flex items-center justify-center shrink-0 shadow">
                          {getServiceIcon(service.iconName)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                          {service.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side (7 cols) */}
                  <div
                    className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#ed3237] uppercase tracking-wider">
                          <HardHat className="w-3.5 h-3.5" />
                          <span>Chuyên Môn Kỹ Thuật</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                          {service.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
                          {service.fullDesc}
                        </p>
                      </div>

                      {/* Tech Highlights Grid */}
                      <div className="pt-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#3e4095]" />
                          <span>Năng lực công nghệ & Tiêu chuẩn áp dụng</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {service.techHighlights.map((hl, hlIdx) => (
                            <div
                              key={hlIdx}
                              className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-[3px] border border-slate-100"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#ed3237] shrink-0 mt-0.5" />
                              <span className="leading-tight font-medium">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Equipment / Machine Fleets */}
                      <div className="pt-1">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Factory className="w-4 h-4 text-[#ed3237]" />
                          <span>Thiết bị cơ giới & Dây chuyền chủ lực</span>
                        </h3>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {service.equipmentList.map((eq, eqIdx) => (
                            <li key={eqIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                              <span>{eq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
