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
      shortDesc: "Làm chủ công nghệ đào hầm NATM tiêu chuẩn quốc tế, thi công khoan nổ mìn vi sai và vỏ hầm vĩnh cửu.",
      fullDesc:
        "Làm chủ toàn diện công nghệ thi công công trình ngầm và hầm giao thông xuyên núi qua các vùng địa chất đứt gãy phức tạp bậc nhất. Trung Hải triển khai quy trình kỹ thuật khép kín từ khâu đào mở gương, chống đỡ sơ bộ tức thời, quan trắc biến dạng đá số hóa đến thi công vỏ hầm bê tông vĩnh cửu và lắp đặt hệ thống cơ điện hầm (M&E/ITS), đáp ứng nghiêm ngặt các quy chuẩn kỹ thuật quốc gia về công trình giao thông cấp đặc biệt.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/h%C3%ACnh%2010.jpg",
      iconName: "mountain",
      techHighlights: [
        "Phương pháp đào hầm NATM (New Austrian Tunnelling Method) chuẩn quốc tế, phân chia gương đào linh hoạt theo cấp địa chất",
        "Kỹ thuật khoan nổ mìn vi sai phi điện, nổ tạo biên (Smooth Blasting) hạn chế tối đa xung chấn vào khối đá vách",
        "Kết cấu chống đỡ sơ bộ chịu lực cao: Neo đá tự khoan/Swellex, vì kèo thép vòm I và bê tông phun sợi thép (Shotcrete)",
        "Quan trắc địa kỹ thuật 24/7, đo hội tụ vách hầm và biến dạng đá (Convergence Monitoring) bằng thiết bị laser chính xác cao",
        "Thi công vỏ hầm vĩnh cửu bằng hệ ván khuôn hầm thủy lực liên tục kết hợp màng chống thấm ngăn nước tuyệt đối",
        "Lắp đặt đồng bộ hệ thống an toàn: Quạt thông gió phản lực (Jet Fan), chiếu sáng thích ứng cửa hầm, PCCC và SCADA/ITS",
      ],
      equipmentList: [
        "Dàn máy khoan hầm thủy lực Jumbo 2 cần - 3 cần điều khiển kỹ thuật số (Atlas Copco / Sandvik)",
        "Robot phun bê tông ướt áp lực cao chuyên dụng thi công vòm hầm công suất lớn",
        "Xe xúc lật ngầm gầu lớn (LHD) và đoàn xe tải chuyên dụng vận chuyển đá hầm gầm thấp",
        "Trạm quạt thông gió cưỡng bức công nghiệp đường kính 2.2m và hệ thống xử lý nước thải hầm",
      ],
    },
    {
      id: "duong-cao-toc",
      tag: "HUYẾT MẠCH GIAO THÔNG",
      title: "Thi Công Đường Cao Tốc & Quốc Lộ Trọng Điểm",
      shortDesc: "Thi công nền mặt đường cấp cao, thảm bê tông nhựa Polyme cải tiến chịu tải trọng nặng và chống hằn lún.",
      fullDesc:
        "Năng lực thi công các gói thầu xây lắp quy mô lớn trên các tuyến cao tốc huyết mạch Bắc - Nam và các tuyến Quốc lộ trọng điểm quốc gia theo tiêu chuẩn TCVN 5729:2012. Từ công tác xử lý nền đất yếu phức tạp, đào đắp nền đường phân lớp kiểm soát độ chặt K98 đến dây chuyền thảm bê tông nhựa Polymer kháng hằn lún vệt bánh xe, mang lại những cung đường có độ êm thuận cao và tuổi thọ vận hành bền vững.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/trangchu.jpg",
      iconName: "route",
      techHighlights: [
        "Xử lý nền đất yếu chuyên sâu: Bấc thấm (PVD) kết hợp gia tải nén chặt, cọc xi măng đất (CDM) và vải địa kỹ thuật cường độ cao",
        "Thi công đào đắp nền đường phân lớp K95, K98 kiểm soát chặt chẽ dung trọng khô và độ ẩm tối ưu",
        "Thi công móng cấp phối đá dăm (CPĐD loại 1, loại 2) và móng cấp phối đá dăm gia cố xi măng (CTB)",
        "Thảm mặt đường bê tông nhựa nóng cải tiến (PMA - Polymer Modified Asphalt) kháng hằn lún vệt bánh xe dưới tải trọng nặng",
        "Đúc dải phân cách giữa và rãnh thoát nước bằng máy đúc bê tông khuôn trượt liên tục (Slipform Paver)",
        "Hoàn thiện hệ thống an toàn giao thông: Hộ lan tôn sóng mạ kẽm, biển báo màng phản quang 3M, sơn nhiệt dẻo theo QCVN 41:2019/BGTVT",
      ],
      equipmentList: [
        "Trạm trộn bê tông nhựa nóng tự động hóa công suất 160 - 240 tấn/giờ kiểm soát cấp phối vi tính",
        "Máy rải thảm chuyên dụng Vögele / Dynapac trang bị cảm biến cao độ siêu âm và laser cân bằng tự động",
        "Dàn lu phối hợp lu rung bánh thép kép Hamm / Bomag và lu bánh lốp 16 - 25 tấn kiểm soát độ chặt K98 và độ rỗng dư",
        "Thiết bị đo độ bằng phẳng mặt đường chuyên dụng bằng công nghệ laser (Profilometer) kiểm soát chỉ số IRI",
      ],
    },
    {
      id: "cau-can-vuot-song",
      tag: "KẾT CẤU CHÍNH XÁC",
      title: "Xây Dựng Cầu Cạn, Cầu Vượt Sông & Nút Giao Phức Tạp",
      shortDesc: "Thi công cọc khoan nhồi ngàm sâu lòng đá, đúc và lao lắp dầm Super T, công nghệ đúc hẫng cân bằng nhịp lớn.",
      fullDesc:
        "Đơn vị thi công kết cấu công trình cầu quy mô lớn, từ các cầu cạn vượt nút giao cao tốc đến các cầu vượt sông lớn khẩu độ dài. Chúng tôi làm chủ các kỹ thuật đúc hẫng cân bằng nhịp lớn, cọc khoan nhồi đường kính lớn ngàm sâu trong địa tầng lòng sông, cùng dây chuyền đúc và lao lắp dầm dự ứng lực chính xác đến từng milimet, đảm bảo tiêu chuẩn thiết kế cầu đường bộ TCVN 11823:2017.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/_MG_3970.jpg",
      iconName: "compass",
      techHighlights: [
        "Khoan cọc nhồi đường kính lớn D1200 - D2000mm ngàm sâu trong tầng đá gốc lòng sông bằng dung dịch giữ thành Polymer/Bentonite",
        "Thi công móng mố trụ sâu trong nước: Hệ vây cọc ván thép Larsen, khung chống chịu lực và bê tông bịt đáy chống thấm nước",
        "Công nghệ thi công đúc hẫng cân bằng (Balanced Cantilever) dầm hộp bê tông cốt thép dự ứng lực khẩu độ nhịp vượt sông lớn",
        "Sản xuất tại bãi đúc và lao lắp dầm Super T, dầm I bê tông dự ứng lực nhịp 33m - 40m bằng giá long môn chuyên dụng",
        "Kiểm soát độ vồng thi công và lực căng kéo cáp dự ứng lực bằng hệ thống kích thủy lực đồng bộ có cảm biến đo áp kỹ thuật số",
        "Thi công chống thấm bản mặt cầu, thảm bê tông nhựa chuyên dụng và lắp đặt khe co giãn răng lược biên độ chuyển vị lớn",
      ],
      equipmentList: [
        "Dàn máy khoan cọc nhồi thủy lực Bauer / Sany lực xoắn lớn chuyên trị địa tầng đá cứng phức tạp",
        "Hệ thống xe đúc hẫng di động (Form Traveler) công nghệ cao chịu tải trọng đốt đúc hàng trăm tấn",
        "Giá long môn lao dầm và dàn xe vận chuyển dầm chuyên dùng tải trọng 120 - 180 tấn",
        "Hệ thống cần trục bánh xích và sà lan cẩu nổi tải trọng từ 80 đến 250 tấn phục vụ thi công cầu vượt sông",
      ],
    },
    {
      id: "dia-ky-thuat-mai-doc",
      tag: "AN TOÀN BỀN VỮNG",
      title: "Gia Cố Mái Dốc, Neo Đất Đá & Xử Lý Sạt Trượt Đèo Núi",
      shortDesc: "Ứng dụng địa kỹ thuật chuyên sâu, khoan neo cáp dự ứng lực sâu, giằng khung dầm bê tông ô cờ và lưới chống đá rơi.",
      fullDesc:
        "Kinh nghiệm dày dặn trong công tác địa kỹ thuật và xử lý sạt trượt mái taluy xung yếu trên các cung đường đèo núi hiểm trở. Trung Hải ứng dụng các giải pháp gia cố kết cấu hiện đại, kết hợp neo cáp dự ứng lực sâu, khung giằng dầm bê tông ô cờ và hệ thống thoát nước ngầm triệt để, ngăn ngừa rủi ro sạt lở đá lăn đá rơi, bảo đảm huyết mạch giao thông thông suốt trong mùa mưa lũ.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/_VTS2047.jpg",
      iconName: "layers",
      techHighlights: [
        "Bạt mái cơ giật cấp giảm tải trọng trượt, phân tầng bậc cơ taluy và tạo hệ rãnh đỉnh đón lũ ngăn xói mòn bề mặt",
        "Khoan neo thanh thép cường độ cao và neo cáp dự ứng lực sâu 15m - 35m ngàm chắc chắn vào đới đá không phong hóa",
        "Thi công khung dầm bê tông cốt thép đúc tại chỗ (khung giằng ô cờ / dầm khóa đầu neo) liên kết phân tán tải trọng ổn định mái dốc",
        "Phun vữa bê tông gia cố (Shotcrete) 2 lớp kết hợp lưới thép cường độ cao bảo vệ bề mặt vách đá chống phong hóa",
        "Lắp đặt màng lưới thép cường độ cao (Tecco Mesh / Rockfall Barrier) chuyên dụng ngăn chặn đá lăn đá lở trên sườn đồi dốc đứng",
        "Thi công tường chắn đất có cốt (MSE Wall), rọ đá và hệ thống ống thoát nước ngầm hạ thấp áp lực nước lỗ rỗng trong lòng mái dốc",
      ],
      equipmentList: [
        "Máy khoan đập đáy (DTH) và máy khoan neo thủy lực cơ động chuyên dụng cho địa hình vách đá dốc đứng",
        "Trạm bơm ép vữa áp lực cao kiểm soát tỷ lệ phụ gia trương nở không co ngót ngàm chặt lỗ neo",
        "Máy phun bê tông ướt áp lực khí nén công suất cao Aliva / Meyco",
        "Hệ sàn treo cơ động, thiết bị tời tải trọng nặng và trang thiết bị thi công an toàn trên vách núi cao",
      ],
    },
    {
      id: "ha-tang-do-thi-kcn",
      tag: "QUY MÔ ĐỒNG BỘ",
      title: "Hạ Tầng Kỹ Thuật Đô Thị & Nền Móng Giao Thông",
      shortDesc: "Đào đắp san nền khối lượng lớn, sản xuất lắp đặt cống hộp khẩu độ lớn và hạ ngầm hệ thống kỹ thuật.",
      fullDesc:
        "Cung cấp giải pháp tổng thể về thi công hạ tầng kỹ thuật các đại dự án giao thông, nút giao liên thông, khu đô thị và khu công nghiệp. Chúng tôi đảm nhận toàn diện từ đào đắp san nền hàng triệu mét khối, lắp đặt hệ thống thoát nước mưa - nước thải khẩu độ lớn, hào kỹ thuật ngầm đến thi công mặt đường nội bộ và trạm dịch vụ cao tốc theo tiến độ và chất lượng cam kết.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/_MG_6389.jpg",
      iconName: "wrench",
      techHighlights: [
        "San lấp mặt bằng quy mô lớn với trắc đạc công nghệ cao GPS / GNSS RTK kiểm soát cao độ và khối lượng đào đắp chính xác",
        "Sản xuất và lắp đặt cống tròn BTCT, cống hộp BTCT đúc sẵn khẩu độ lớn (cống hộp đơn, đôi) chịu tải trọng xe nặng H30 - XB80",
        "Thi công hầm chui dân sinh, cống chui giao thông trên tuyến cao tốc bảo đảm kín nước tuyệt đối và an toàn chịu lực cao",
        "Mạng lưới hào kỹ thuật (Tuynel/Trench) hạ ngầm đồng bộ hệ thống cáp điện trung/hạ thế, cáp thông tin và chiếu sáng đô thị",
        "Hệ thống thoát nước mưa - thoát nước thải sinh hoạt và công nghiệp riêng biệt kết nối trạm xử lý nước thải tập trung",
        "Thi công mặt đường bê tông xi măng hoàn thiện bằng máy cào phẳng hoặc thảm bê tông nhựa nóng đồng bộ cảnh quan vỉa hè",
      ],
      equipmentList: [
        "Đoàn xe máy ủi công suất lớn Komatsu D65, D85 và đoàn máy xúc đào gầu 0.9 - 1.6 m3 cơ động cao",
        "Dàn xe lu rung 16 - 25 tấn bảo đảm độ chặt nền đắp K95 - K98 theo chuẩn thiết kế",
        "Cần cẩu tự hành và xe vận chuyển chuyên dụng lắp đặt cấu kiện cống hộp, hào kỹ thuật khẩu độ nặng",
        "Trạm trộn bê tông xi măng thương phẩm tự động công suất 90 - 120 m3/h và trạm nghiền sàng đá tại mỏ",
      ],
    },
    {
      id: "dan-dung-nha-xuong",
      tag: "NĂNG LỰC CUNG ỨNG & CHẾ TẠO",
      title: "Kết Cấu Bê Tông Đúc Sẵn & Cơ Khí Giao Thông",
      shortDesc: "Gia công dầm bê tông, cống hộp, cấu kiện đúc sẵn và kết cấu thép phục vụ thi công cầu đường, cao tốc.",
      fullDesc:
        "Chủ động chuỗi cung ứng vật tư và cấu kiện bê tông đúc sẵn chất lượng cao phục vụ các công trình cầu đường, cao tốc và hầm xuyên núi. Sở hữu bãi đúc dầm quy chuẩn, xưởng gia công lồng thép tự động và xưởng cơ khí chế tạo phụ kiện xây lắp, Trung Hải luôn bảo đảm nguồn vật tư cấu kiện chuẩn kỹ thuật, tối ưu hóa tiến độ công trường.",
      image: "https://6adae65b086c9bf0741038e3.imgix.net/sandbox/_MG_6389.jpg",
      iconName: "building",
      techHighlights: [
        "Gia công chế tạo kết cấu bãi đúc dầm Super T, dầm I và ván khuôn thép định hình khẩu độ lớn",
        "Sản xuất các loại cấu kiện bê tông đúc sẵn: Cống hộp, cống tròn, dải phân cách giữa, tấm ốp mái taluy, rãnh hộp thoát nước",
        "Gia công lắp dựng kết cấu thép nhà điều hành, trạm thu phí không dừng (ETC) và nhà xưởng cơ khí phụ trợ",
        "Kiểm soát chất lượng vật liệu đầu vào (cát, đá, xi măng, thép cường độ cao) theo hệ thống quản lý ISO 9001:2015",
        "Cung ứng thiết bị cơ giới thi công chuyên dụng và vật tư xây lắp cho các dự án hạ tầng giao thông",
      ],
      equipmentList: [
        "Hệ thống trạm trộn bê tông ướt phục vụ bãi đúc dầm điều khiển điện tử",
        "Dàn cẩu long môn bãi đúc tải trọng 60 - 100 tấn vận chuyển cấu kiện đúc sẵn",
        "Máy uốn, cắt, hàn thép tự động và thiết bị căng kéo cáp dự ứng lực thủy lực kiểm định định kỳ",
        "Đoàn xe vận tải chuyên dụng chở cấu kiện siêu trường, siêu trọng đến chân công trình",
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
                className="flex items-center gap-1 text-slate-600 hover:text-[#3e4095] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-[#3e4095] font-semibold">Lĩnh vực hoạt động</li>
          </ol>
        </nav>

        {/* Page Title Header */}
        <div className="pb-6 border-b border-slate-200 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-blue-50 border border-blue-200/80 text-[#3e4095] text-xs font-bold uppercase tracking-wider mb-2.5">
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
                        <div className="w-6 h-6 rounded-[3px] bg-[#3e4095] text-white flex items-center justify-center shrink-0 shadow">
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
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3e4095] uppercase tracking-wider">
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
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3e4095] shrink-0 mt-0.5" />
                              <span className="leading-tight font-medium">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Equipment / Machine Fleets */}
                      <div className="pt-1">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Factory className="w-4 h-4 text-[#3e4095]" />
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
