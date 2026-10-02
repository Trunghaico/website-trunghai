import { Project, NewsPost, JobPosting, HeroSlide, CompanySettings } from "@/types";

export const initialCompanySettings: CompanySettings = {
  name: "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
  shortName: "TRUNG HAI JSC",
  slogan: "Tiên phong kiến tạo những công trình giao thông huyết mạch",
  taxCode: "0312019045",
  address: "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
  phone: "0966.700.045",
  hotline: "0966.700.045",
  email: "info@trunghaico.vn",
  facebook: "https://facebook.com/trunghaico.vn",
  youtube: "https://youtube.com/@trunghaico",
  profilePdfUrl: "#",
};

export const initialHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "DỰ ÁN HẦM ĐƯỜNG BỘ QUA ĐÈO CẢ",
    subtitle: "Kỳ tích chinh phục đèo hiểm trở bậc nhất duyên hải miền Trung nối liền Phú Yên và Khánh Hòa",
    tag: "ĐẠI CÔNG TRÌNH QUỐC GIA",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=2000&q=80",
    stats: { label: "Chiều dài hầm", value: "4.125 m" },
  },
  {
    id: "slide-2",
    title: "DỰ ÁN HẦM ĐƯỜNG BỘ CÙ MÔNG",
    subtitle: "Kết nối thông suốt hai tỉnh Bình Định - Phú Yên, rút ngắn thời gian và đảm bảo an toàn tuyệt đối",
    tag: "CÔNG NGHỆ ĐÀO HẦM HIỆN ĐẠI",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80",
    stats: { label: "Tổng mức đầu tư", value: "3.921 Tỷ VNĐ" },
  },
  {
    id: "slide-3",
    title: "HẦM PHƯỚC TƯỢNG – PHÚ GIA",
    subtitle: "Xóa bỏ 'điểm đen' tai nạn trên Quốc lộ 1 qua Thừa Thiên Huế, khơi thông huyết mạch miền Trung",
    tag: "HẠ TẦNG TRỌNG ĐIỂM",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
    stats: { label: "Thời gian thông hầm", value: "Vượt tiến độ" },
  },
  {
    id: "slide-4",
    title: "NÂNG CẤP MỞ RỘNG QUỐC LỘ 1 KHÁNH HÒA",
    subtitle: "Tăng cường năng lực vận tải Bắc - Nam, bảo đảm tiêu chuẩn kỹ thuật đường cấp cao",
    tag: "TUYẾN ĐƯỜNG HUYẾT MẠCH",
    image: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=2000&q=80",
    stats: { label: "Quy mô làn xe", value: "4 làn cơ giới" },
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Dự án Hầm đường bộ qua Đèo Cả (Hầm Đèo Cả & Hầm Cổ Mã)",
    slug: "ham-duong-bo-deo-ca",
    category: "ham",
    categoryName: "Hầm Xuyên Núi",
    client: "Bộ Giao thông Vận tải / Ban QLDA Hầm Đèo Cả",
    location: "Ranh giới tỉnh Phú Yên & Khánh Hòa",
    year: "2013 - 2017",
    value: "11.378 Tỷ VNĐ",
    scale: "2 ống hầm song song, mỗi ống rộng 9.75m, hầm Đèo Cả dài 4.125m, hầm Cổ Mã dài 500m",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Dự án Hầm đường bộ qua Đèo Cả là một trong những công trình giao thông trọng điểm quốc gia lớn nhất miền Trung. Trung Hải tham gia với vai trò nhà thầu thi công các hạng mục đào hầm, gia cố vỏ hầm bê tông và đường dẫn, áp dụng công nghệ đào hầm NATM tiên tiến của Áo.",
    highlights: [
      "Áp dụng phương pháp đào hầm NATM (New Austrian Tunnelling Method)",
      "Vượt qua các tầng địa chất đứt gãy phức tạp, độ ẩm cao",
      "Bảo đảm an toàn tuyệt đối 100% trong suốt quá trình khoan hầm",
      "Rút ngắn thời gian qua đèo từ 45 phút xuống chỉ còn 10 phút",
    ],
    featured: true,
  },
  {
    id: "proj-2",
    title: "Dự án Hầm đường bộ Cù Mông",
    slug: "ham-duong-bo-cu-mong",
    category: "ham",
    categoryName: "Hầm Xuyên Núi",
    client: "Công ty Cổ phần Đầu tư Đèo Cả",
    location: "Bình Định - Phú Yên",
    year: "2015 - 2019",
    value: "3.921 Tỷ VNĐ",
    scale: "Chiều dài hầm 2.600m, đường dẫn 4.020m, vận tốc thiết kế 80km/h",
    thumbnail: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Hầm Cù Mông là công trình hầm đường bộ xuyên núi dài thứ 3 tại Việt Nam sau hầm Hải Vân và hầm Đèo Cả. Công trình giải quyết triệt để cung đường đèo hiểm trở hay xảy ra tai nạn giao thông và sạt lở vào mùa mưa lũ.",
    highlights: [
      "Khối lượng đất đá đào hơn 500.000 m3",
      "Hệ thống thông gió phản lực và chiếu sáng thông minh tiết kiệm năng lượng",
      "Thông xe sớm hơn kế hoạch gần 3 tháng",
    ],
    featured: true,
  },
  {
    id: "proj-3",
    title: "Dự án Hầm Phước Tượng – Phú Gia",
    slug: "ham-phuoc-tuong-phu-gia",
    category: "ham",
    categoryName: "Hầm Xuyên Núi",
    client: "Bộ Giao thông Vận tải",
    location: "Huyện Phú Lộc, Tỉnh Thừa Thiên Huế",
    year: "2013 - 2015",
    value: "1.743 Tỷ VNĐ",
    scale: "Hầm Phước Tượng dài 375m; Hầm Phú Gia dài 447m; đường dẫn 7.8km",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Hầm Phước Tượng và Phú Gia nằm trên địa bàn huyện Phú Lộc, tỉnh Thừa Thiên Huế. Việc hoàn thành hai hầm này đã xóa tan hai điểm đen giao thông nguy hiểm bậc nhất trên tuyến Quốc lộ 1 qua vùng đầm phá Cầu Hai.",
    highlights: [
      "Công trình hoàn thành vượt tiến độ đề ra",
      "Thi công trong điều kiện mặt bằng hẹp và lưu lượng xe lưu thông liên tục",
      "Nhận bằng khen của Bộ Giao thông Vận tải",
    ],
    featured: true,
  },
  {
    id: "proj-4",
    title: "Nâng cấp, mở rộng Quốc lộ 1 đoạn qua tỉnh Khánh Hòa",
    slug: "mo-rong-quoc-lo-1-khanh-hoa",
    category: "quoc-lo",
    categoryName: "Quốc Lộ & Cao Tốc",
    client: "Ban QLDA 7 - Bộ Giao thông Vận tải",
    location: "Tỉnh Khánh Hòa",
    year: "2014 - 2016",
    value: "2.688 Tỷ VNĐ",
    scale: "Mở rộng 4 làn xe cơ giới, 2 làn xe thô sơ, dải phân cách giữa kiên cố",
    thumbnail: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Gói thầu thi công nền mặt đường bê tông nhựa, cầu cống thoát nước và hệ thống an toàn giao thông trên tuyến Quốc lộ 1 qua địa bàn tỉnh Khánh Hòa.",
    highlights: [
      "Áp dụng công nghệ thảm bê tông nhựa Polyme chịu tải trọng cao",
      "Bảo đảm an toàn giao thông suốt quá trình vừa thi công vừa khai thác",
    ],
    featured: true,
  },
  {
    id: "proj-5",
    title: "Cầu cạn và nút giao kết nối hạ tầng giao thông cao tốc",
    slug: "cau-can-nut-giao-cao-toc",
    category: "cau-duong",
    categoryName: "Cầu & Đường Bộ",
    client: "Tổng công ty Đầu tư Phát triển Đường cao tốc Việt Nam",
    location: "Khu vực Duyên hải Nam Trung Bộ",
    year: "2018 - 2021",
    value: "950 Tỷ VNĐ",
    scale: "Cầu dầm Super T bê tông cốt thép dự ứng lực, nhịp đúc hẫng cân bằng",
    thumbnail: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Thi công hệ thống cầu cạn và các nhánh nút giao liên thông, kết nối các tuyến cao tốc huyết mạch với các khu kinh tế ven biển.",
    highlights: [
      "Thi công kết cấu dầm Super T vượt nhịp lớn",
      "Khoan cọc nhồi đường kính lớn vào nền đá ngầm",
    ],
    featured: false,
  },
  {
    id: "proj-6",
    title: "Gia cố mái ta luy & Xử lý sạt trượt địa chất đèo núi",
    slug: "gia-co-mai-ta-luy-sat-truot",
    category: "ha-tang",
    categoryName: "Hạ Tầng Kỹ Thuật",
    client: "Cục Đường bộ Việt Nam",
    location: "Miền Trung & Tây Nguyên",
    year: "2020 - 2023",
    value: "420 Tỷ VNĐ",
    scale: "Hệ thống neo cáp dự ứng lực, lưới thép cường độ cao, tường chắn bê tông",
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Ứng dụng công nghệ khoan neo trong đá, phun vữa gia cố và lưới chắn đá rơi để bảo vệ tuyệt đối an toàn cho các cung đường đèo hiểm trở vào mùa mưa bão.",
    highlights: [
      "Công nghệ khoan neo sâu trong tầng đá nứt nẻ",
      "Phun vữa bảo vệ mái dốc chống xói mòn sinh học",
    ],
    featured: false,
  },
];

export const initialNews: NewsPost[] = [
  {
    id: "news-1",
    title: "Trung Hải đẩy mạnh ứng dụng công nghệ cơ giới hóa hiện đại trong thi công hầm",
    slug: "ung-dung-cong-nghe-thi-cong-ham-hien-dai",
    category: "du-an",
    categoryName: "Tin Dự Án",
    summary:
      "Công ty Cổ phần Xây dựng và Đầu tư Trung Hải tiếp tục đầu tư dàn xe khoan hầm thủy lực tự hành và máy phun bê tông robot thế hệ mới nhất.",
    content:
      "Để đáp ứng yêu cầu khắt khe về kỹ thuật và tiến độ của các dự án giao thông trọng điểm quốc gia, Ban Lãnh đạo Công ty CP Xây dựng và Đầu tư Trung Hải đã quyết định đầu tư thêm hệ thống xe khoan hầm 2 cần tự hành, máy phun vẩy bê tông thế hệ mới nhập khẩu từ châu Âu. Việc này giúp tăng 30% tốc độ đào hầm đồng thời đảm bảo an toàn tuyệt đối cho người lao động tại gương hầm.",
    date: "15/09/2026",
    author: "Ban Biên Tập",
    thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "news-2",
    title: "Phát động phong trào thi đua '90 ngày đêm vượt tiến độ' tại các công trường trọng điểm",
    slug: "phat-dong-thi-dua-90-ngay-dem",
    category: "doanh-nghiep",
    categoryName: "Tin Doanh Nghiệp",
    summary:
      "Tất cả các mũi thi công của Trung Hải tại miền Trung đồng loạt ra quân với tinh thần 'vượt nắng thắng mưa, ăn tranh thủ ngủ khẩn trương'.",
    content:
      "Hưởng ứng phong trào thi đua của ngành Giao thông vận tải, toàn thể cán bộ, kỹ sư và công nhân viên Công ty Trung Hải đã ký cam kết thi đua hoàn thành vượt tiến độ các hạng mục nền đường, đúc dầm và hạ tầng kỹ thuật trước mùa mưa bão.",
    date: "02/08/2026",
    author: "Công Đoàn Trung Hải",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "news-3",
    title: "Trung Hải nhận khen thưởng về công tác bảo đảm an toàn vệ sinh lao động xuất sắc",
    slug: "khen-thuong-an-toan-lao-dong",
    category: "an-toan",
    categoryName: "An Toàn Lao Động",
    summary:
      "Trải qua hàng triệu giờ làm việc trên các công trình hầm và cầu đường, công ty luôn giữ vững chỉ số an toàn tuyệt đối.",
    content:
      "Với phương châm 'An toàn là danh dự của người thợ cầu đường', Trung Hải thực hiện quy trình giám sát an toàn nghiêm ngặt từ khâu thông gió gương hầm, đo nồng độ khí độc, đến kiểm định máy móc định kỳ.",
    date: "18/06/2026",
    author: "Phòng An Toàn HSE",
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

export const initialJobs: JobPosting[] = [
  {
    id: "job-1",
    title: "Kỹ sư Cầu đường / Kỹ sư Hiện trường Công trình",
    department: "Ban Quản lý Dự án & Kỹ thuật Thi công",
    location: "Duyên hải Miền Trung (Khánh Hòa, Phú Yên, Huế)",
    salary: "18.000.000 - 28.000.000 VNĐ",
    deadline: "30/11/2026",
    type: "Toàn thời gian",
    description: [
      "Trực tiếp giám sát và chỉ đạo thi công các hạng mục cầu đường, hầm đường bộ theo bản vẽ thiết kế.",
      "Triển khai biện pháp thi công, kiểm soát chất lượng vật liệu, nghiệm thu công việc với Tư vấn giám sát.",
      "Lập tiến độ thi công tuần, tháng và báo cáo Chỉ huy trưởng công trình.",
    ],
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Cầu đường, Xây dựng Công trình Giao thông (ĐH GTVT, ĐH Bách Khoa...).",
      "Kinh nghiệm từ 3 năm trở lên tại các dự án đường bộ, cầu hoặc thi công hầm.",
      "Thành thạo AutoCAD, MS Project, dự toán và các phần mềm chuyên ngành.",
      "Chịu được áp lực tiến độ công trường, sẵn sàng đi công tác.",
    ],
    benefits: [
      "Lương cạnh tranh + Thưởng tiến độ dự án + Phụ cấp công trình xa nhà đầy đủ.",
      "Bao ăn ở tại khu nhà điều hành công trường tiện nghi, có điều hòa, bếp ăn riêng.",
      "Đóng BHXH, BHYT đầy đủ theo quy định của nhà nước, bảo hiểm tai nạn 24/7.",
      "Cơ hội thăng tiến lên vị trí Chỉ huy phó / Chỉ huy trưởng công trường.",
    ],
    active: true,
  },
  {
    id: "job-2",
    title: "Chỉ huy trưởng Công trình Giao thông",
    department: "Khối Điều hành Thi công",
    location: "Miền Trung / TP. Hồ Chí Minh",
    salary: "35.000.000 - 55.000.000 VNĐ",
    deadline: "15/12/2026",
    type: "Toàn thời gian",
    description: [
      "Chịu trách nhiệm toàn diện về tiến độ, chất lượng, chi phí và an toàn của toàn bộ gói thầu.",
      "Đại diện nhà thầu làm việc với Chủ đầu tư, Tư vấn giám sát và chính quyền địa phương.",
      "Quản lý, phân công nhiệm vụ cho các đội thi công, nhà thầu phụ và đội máy móc cơ giới.",
    ],
    requirements: [
      "Có chứng chỉ hành nghề Chỉ huy trưởng công trình giao thông Hạng 1 hoặc Hạng 2.",
      "Tối thiểu 7 năm kinh nghiệm, từng giữ chức vụ Chỉ huy trưởng ít nhất 2 dự án giao thông cấp 1 hoặc hầm đường bộ.",
      "Kỹ năng quản trị, giải quyết phát sinh hiện trường quyết liệt, chuẩn xác.",
    ],
    benefits: [
      "Mức thu nhập hấp dẫn theo thỏa thuận xứng đáng với năng lực.",
      "Thưởng phần trăm theo hiệu quả kinh tế của gói thầu khi hoàn thành.",
      "Xe đưa đón phục vụ công tác, chế độ phúc lợi cao cấp dành cho cấp quản trị.",
    ],
    active: true,
  },
  {
    id: "job-3",
    title: "Kỹ sư Trắc đạc / Đo đạc Địa hình",
    department: "Phòng Khảo sát & Kỹ thuật",
    location: "Công trường các tỉnh miền Trung",
    salary: "15.000.000 - 22.000.000 VNĐ",
    deadline: "20/11/2026",
    type: "Toàn thời gian",
    description: [
      "Đo đạc, định vị tim tuyến đường, trắc dọc, trắc ngang và tọa độ hầm xuyên núi.",
      "Sử dụng máy toàn đạc điện tử, máy thủy bình, định vị vệ tinh GPS RTK.",
      "Lập hồ sơ hoàn công trắc đạc theo quy chuẩn nghiệm thu.",
    ],
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học chuyên ngành Trắc địa công trình hoặc Cầu đường.",
      "Có từ 2 năm kinh nghiệm đo đạc công trình giao thông thực tế.",
      "Cẩn thận, chính xác, trung thực trong số liệu đo.",
    ],
    benefits: [
      "Môi trường làm việc trang bị máy móc trắc địa hiện đại (Leica, Topcon đời mới).",
      "Bao ăn ở trọn gói tại ban điều hành công trường.",
      "Thưởng các dịp lễ tết và thưởng hoàn thành mốc công trình.",
    ],
    active: true,
  },
];
