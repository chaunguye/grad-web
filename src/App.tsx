import { useEffect, useRef, useState } from "react";

type IconName =
  | "edit"
  | "download"
  | "arrow"
  | "close"
  | "check"
  | "like"
  | "comment"
  | "send"
  | "bookmark"
  | "briefcase"
  | "pin"
  | "clock"
  | "calendar"
  | "globe"
  | "cap"
  | "home"
  | "people";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    edit: (
      <>
        <path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z" />
        <path d="M13 20h7" />
      </>
    ),
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    like: <path d="M7 10H3v11h4m0-11 5-8c3 0 3 3 1 7h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7Z" />,
    comment: <path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z" />,
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="m11 13 6-6" />
      </>
    ),
    bookmark: <path d="M6 3h12v19l-6-4-6 4Z" />,
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V3h8v4M3 12a22 22 0 0 0 18 0m-9 0v3" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v5m10-5v5M3 11h18m-13 5h2m4 0h2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    cap: (
      <>
        <path d="m2 8 10-5 10 5-10 5ZM6 10v7q6 5 12 0v-7M22 8v8" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3Z" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 22v-3a7 7 0 0 1 14 0v3m0-19a4 4 0 0 1 0 8m3 4a6 6 0 0 1 3 5v2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const defaultMessage =
  "Tôi rất hào hứng thông báo: sau nhiều năm tối ưu thuật toán và tiêu thụ cà phê, tôi đã chính thức đủ điều kiện mặc áo choàng ra ngoài vào ban ngày.\n\nNhân dịp tốt nghiệp ngành Khoa học Máy tính, tôi đang tìm kiếm những đồng đội chiến lược đến chung vui, vỗ tay và xác nhận rằng tôi thực sự có bằng.";
const emptyDetails = {
  graduate: "Nguyễn Trịnh Châu",
  friend: "",
  date: "Chủ nhật, 29/11/2026",
  time: "10:00 sáng",
  venue: "Cơ sở 1: 268 Lý Thường Kiệt, Phường Diên Hồng, Tp.HCM",
};

export default function App() {
  const [details, setDetails] = useState(emptyDetails);
  const [draft, setDraft] = useState(emptyDetails);
  const [message, setMessage] = useState(defaultMessage);
  const [draftMessage, setDraftMessage] = useState(defaultMessage);
  const [modal, setModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const [previewComment, setPreviewComment] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const author = details.graduate || "Một tân cử nhân";
  const initials = details.graduate
    ? details.graduate
        .split(/\s+/)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "TN";
  const eventRows: { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar", label: "Ngày onboard", value: details.date || "Chờ chốt lịch tốt nghiệp" },
    {
      icon: "clock",
      label: "Giờ check-in",
      value: details.time || "Sẽ thông báo, không họp sớm đâu",
    },
    { icon: "pin", label: "Văn phòng hôm đó", value: details.venue || "Địa điểm sẽ được cập nhật" },
  ];

  function openEdit() {
    openerRef.current = document.activeElement as HTMLElement;
    setDraft(details);
    setDraftMessage(message);
    setModal(true);
  }

  useEffect(() => {
    if (!modal) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setModal(false);
      if (event.key === "Tab") {
        const elements = document.querySelectorAll<HTMLElement>(
          ".edit-modal button, .edit-modal input, .edit-modal textarea",
        );
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
      openerRef.current?.focus();
    };
  }, [modal]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function downloadCard() {
    setDownloading(true);
    try {
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1700;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      function text(value: string, x: number, y: number, width: number, lineHeight: number) {
        let currentY = y;
        for (const paragraph of value.split("\n")) {
          let line = "";
          for (const word of paragraph.split(" ")) {
            if (ctx!.measureText(line + word).width > width && line) {
              ctx!.fillText(line.trim(), x, currentY);
              currentY += lineHeight;
              line = "";
            }
            line += `${word} `;
          }
          ctx!.fillText(line.trim(), x, currentY);
          currentY += lineHeight;
        }
        return currentY;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1200, 1700);
      ctx.fillStyle = "#0a66c2";
      ctx.fillRect(0, 0, 1200, 10);
      ctx.font = '700 34px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = "#1d2939";
      ctx.fillText(author, 70, 90, 1060);
      ctx.font = '23px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = "#657183";
      ctx.fillText("Tân cử nhân Khoa học Máy tính · Đang tuyển bạn đi dự lễ", 70, 136);
      ctx.fillStyle = "#283342";
      ctx.font = '25px "Be Vietnam Pro", sans-serif';
      text(message, 70, 205, 1060, 39);
      const top = 640;
      ctx.fillStyle = "#0a66c2";
      ctx.fillRect(0, top, 1200, 510);
      ctx.fillStyle = "#cce4ff";
      ctx.font = '600 19px "Be Vietnam Pro", sans-serif';
      ctx.fillText("PHÒNG NHÂN SỰ · DỰ ÁN TỐT NGHIỆP", 70, top + 58);
      ctx.fillStyle = "#ffffff";
      ctx.font = '800 68px "Be Vietnam Pro", sans-serif';
      ["TUYỂN ĐỒNG ĐỘI", "ĐI DỰ LỄ", "TỐT NGHIỆP."].forEach((line, i) =>
        ctx.fillText(line, 65, top + 158 + i * 88),
      );
      ctx.fillStyle = "#d8f6a9";
      ctx.font = '500 25px "Be Vietnam Pro", sans-serif';
      ctx.fillText("Không cần kinh nghiệm. Chỉ cần có mặt.", 70, top + 460);
      ctx.fillStyle = "#1d2939";
      ctx.font = '600 28px "Be Vietnam Pro", sans-serif';
      ctx.fillText(
        details.friend
          ? `Gửi ứng viên tiềm năng: ${details.friend}`
          : "Vị trí: Bạn thân đồng hành · Số lượng: Có bạn là đủ",
        70,
        1220,
        1060,
      );
      eventRows.forEach((row, i) => {
        ctx.font = '500 20px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = "#697586";
        ctx.fillText(row.label.toUpperCase(), 70, 1290 + i * 95);
        ctx.font = '500 27px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = "#1d2939";
        ctx.fillText(row.value, 70, 1330 + i * 95, 1060);
      });
      ctx.fillStyle = "#0a66c2";
      ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
      ctx.fillText("Ứng tuyển bằng cách nhắn mình: “Có mặt!”", 70, 1625);
      ctx.font = '16px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = "#7a8694";
      ctx.fillText("Thiệp mời tốt nghiệp vui nhộn · Không phải tin tuyển dụng thật.", 70, 1670);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Export unavailable");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "thu-moi-onboard-le-tot-nghiep.png";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Đã xuất thiệp PNG. Sẵn sàng gửi cho ứng viên chiến lược!");
    } catch {
      setNotice("Phòng IT gặp chút sự cố. Bạn thử tải lại thiệp nhé.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="app" lang="vi">
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#" className="brand" aria-label="Trang chủ TốtNghiệpIn">
            tốtnghiệp<span>in</span>
          </a>
          <div className="nav-divider" />
          <span className="parody-label">Mạng xã hội của người sắp có bằng.</span>
          <nav aria-label="Điều hướng">
            <span className="nav-active">
              <Icon name="home" size={19} />
              Bảng tin
            </span>
            <button onClick={openEdit}>
              <Icon name="edit" size={18} />
              <span>Chỉnh sửa thiệp</span>
            </button>
            <button
              className="nav-avatar"
              onClick={openEdit}
              aria-label="Chỉnh sửa thông tin của bạn"
            >
              {initials}
            </button>
          </nav>
        </div>
      </header>

      <main className="layout">
        <aside className="left-column">
          <section className="panel profile-card">
            <div className="profile-cover">
              <span>{"{ tốt_nghiệp: true }"}</span>
              <Icon name="cap" size={36} />
            </div>
            <div className="profile-avatar">
              {initials}
              <span>✓</span>
            </div>
            <div className="profile-info">
              <h2>{author}</h2>
              <p>
                Tân cử nhân Khoa học Máy tính
                <br />
                Giám đốc Điều hành sự lo lắng
              </p>
              <span className="open-badge">#SẴNSÀNGTỐTNGHIỆP</span>
            </div>
            <div className="profile-stats">
              <div>
                <span>Số năm chạy deadline</span>
                <strong>4+</strong>
              </div>
              <div>
                <span>Lần muốn bỏ ngành</span>
                <strong>∞</strong>
              </div>
            </div>
            <button className="profile-edit" onClick={openEdit}>
              <Icon name="edit" size={15} />
              Cập nhật hồ sơ ứng viên
            </button>
          </section>
          <section className="panel side-note">
            <span className="section-overline">GHI CHÚ NỘI BỘ</span>
            <p>
              Đây là thiệp mời tốt nghiệp.
              <br />
              Không phải tin tuyển dụng.
            </p>
            <p className="muted">
              Nhưng tình bạn này là
              <br />
              hợp đồng vô thời hạn.
            </p>
            <div className="note-signature">Phòng Nhân sự (có mỗi tôi)</div>
          </section>
          <div className="sidebar-footer">
            Không KPI. Không thử việc.
            <br />
            Chỉ có kỷ niệm.
          </div>
        </aside>

        <div className="feed-column">
          <section className="feed-intro">
            <div>
              <span className="eyebrow">MỘT CỘT MỐC MỚI. MỘT CHIẾC JD RẤT LẠ.</span>
              <h1>Thông báo tuyển… bạn.</h1>
            </div>
            <span className="live-badge">
              <i />
              Đang nhận tình cảm
            </span>
          </section>
          <div className="feed-sort">
            <span>Dành riêng cho hội bạn thân</span>
            <span>
              Ưu tiên: <b>Có mặt</b>
              <span className="sort-caret">▾</span>
            </span>
          </div>
          <article className="panel post">
            <div className="post-context">
              <Icon name="briefcase" size={14} />
              <span>Cơ hội không lương, nhưng có tương lai trong album ảnh</span>
            </div>
            <div className="post-author">
              <div className="author-avatar">{initials}</div>
              <div className="author-info">
                <h2>
                  {author}
                  <span> · Chủ xị</span>
                </h2>
                <p>Tân cử nhân KHMT | Chuyên viên xử lý bug & khủng hoảng hiện sinh</p>
                <span>
                  Vừa xong · <Icon name="globe" size={11} />
                </span>
              </div>
              <button
                className={`bookmark-button ${saved ? "is-saved" : ""}`}
                aria-label={saved ? "Bỏ lưu bài đăng" : "Lưu bài đăng"}
                aria-pressed={saved}
                onClick={() => {
                  setSaved(!saved);
                  setNotice(
                    saved
                      ? "Đã bỏ lưu trong bản xem thử."
                      : "Đã ghim trong phiên này. Nhớ tải thiệp để giữ lại nhé.",
                  );
                }}
              >
                <Icon name="bookmark" size={19} />
              </button>
            </div>
            <div className="post-copy">
              {details.friend && (
                <p className="personal-greeting">
                  Gửi ứng viên tiềm năng: <strong>{details.friend}</strong>,
                </p>
              )}
              <p className="opening-line">[THÔNG BÁO TUYỂN DỤNG ĐỒNG ĐỘI ĐI TỐT NGHIỆP]</p>
              <p className="custom-message">{message}</p>
              <p>
                Vị trí: <strong>Chuyên viên Hiện diện & Vỗ tay cấp cao.</strong>
                <br />
                Hình thức: On-site. Vì ôm nhau không thể remote.
              </p>
              <p className="hashtags">#TotNghiep #TuyenBanKhongTuyenNhanVien #OpenToCelebrate</p>
            </div>

            <div className="hiring-poster">
              <div className="poster-topline">
                <span>
                  <span className="tiny-square" /> PHÒNG NHÂN SỰ · DỰ ÁN TỐT NGHIỆP
                </span>
                <span>JD / 001</span>
              </div>
              <div className="poster-main">
                <div className="poster-copy">
                  <span className="recruiting-badge">ĐANG TÌM ĐỒNG ĐỘI</span>
                  <h2>
                    Tuyển bạn
                    <br />
                    đi dự lễ
                    <br />
                    <span>tốt nghiệp.</span>
                  </h2>
                  <p>
                    Cùng kiến tạo giá trị.
                    <br />
                    Giá trị ở đây là ảnh đẹp.
                  </p>
                </div>
                <div className="poster-visual">
                  <div className="jensen-frame">
                    <img
                      src="/images/jensen-graduation.png"
                      alt="Tranh hoạt hình Jensen Huang mặc áo da, đội mũ tốt nghiệp và cầm card đồ họa"
                    />
                    <span>CỐ VẤN TINH THẦN*</span>
                  </div>
                  <div className="sticker">
                    <Icon name="check" size={14} />
                    Không yêu cầu kinh nghiệm
                  </div>
                  <span className="visual-footnote">
                    *Jensen không tới.
                    <br />
                    Nhưng bạn thì nên.
                  </span>
                </div>
              </div>
              <div className="poster-bottom">
                <span>
                  <Icon name="people" size={15} /> Số lượng: Có bạn là đủ
                </span>
                <span>
                  Lương: Một cái ôm <Icon name="arrow" size={15} />
                </span>
              </div>
            </div>

            <div className="job-preview">
              <div className="job-icon">
                <Icon name="briefcase" size={23} />
              </div>
              <div>
                <h3>Bạn thân đồng hành (không cần CV)</h3>
                <p>Biên chế trọn đời · Phúc lợi: được tôi quý</p>
              </div>
              <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                {expanded ? "Thu gọn" : "Xem JD"}
                <Icon name="arrow" size={15} />
              </button>
            </div>
            {expanded && (
              <div className="job-description">
                <h3>Mô tả công việc có tính chiến lược</h3>
                <ul>
                  <li>Check-in đúng giờ, đồng bộ năng lượng tích cực với chủ xị.</li>
                  <li>Vỗ tay khi tôi nhận bằng. KPI: khiến người bên cạnh giật mình.</li>
                  <li>Chụp ảnh đến khi có ít nhất một tấm không ai nhắm mắt.</li>
                  <li>Không hỏi “bao giờ đi làm?” trong suốt thời gian onboarding.</li>
                </ul>
                <p>
                  <strong>Quyền lợi:</strong> môi trường nhiều hoa, văn hóa nhiều ảnh, lộ trình
                  thăng tiến từ bạn thân lên bạn cực thân.
                </p>
                <p>
                  <strong>Cách ứng tuyển:</strong> nhắn riêng cho mình “Có mặt!” để xác nhận. Không
                  có form, không có vòng phỏng vấn.
                </p>
              </div>
            )}
            <div className="post-engagement">
              <span>
                <span className="reaction-circle">
                  <Icon name="like" size={10} />
                </span>
                {liked
                  ? "Bạn và cả phòng Nhân sự đều ủng hộ"
                  : "Phòng Nhân sự tự ủng hộ bài viết này"}
              </span>
              <span>100% chân thành · 0% lương</span>
            </div>
            <div className="post-actions">
              <button
                className={liked ? "liked" : ""}
                onClick={() => setLiked(!liked)}
                aria-pressed={liked}
              >
                <Icon name="like" />
                {liked ? "Đã ủng hộ" : "Ủng hộ"}
              </button>
              <button onClick={() => setCommenting(!commenting)} aria-expanded={commenting}>
                <Icon name="comment" />
                Góp ý chiến lược
              </button>
              <button onClick={downloadCard} disabled={downloading}>
                <Icon name="send" />
                {downloading ? "Đang xuất…" : "Gửi thiệp"}
              </button>
            </div>
            {commenting && (
              <form
                className="comment-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (comment.trim()) {
                    setPreviewComment(comment.trim());
                    setComment("");
                  }
                }}
              >
                <label htmlFor="comment">Bình luận thử · chỉ hiển thị trong phiên này</label>
                <div>
                  <input
                    id="comment"
                    autoFocus
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={200}
                    placeholder="Tôi xin ứng tuyển vị trí vỗ tay…"
                  />
                  <button type="submit" aria-label="Thêm bình luận thử" disabled={!comment.trim()}>
                    <Icon name="send" size={18} />
                  </button>
                </div>
                {previewComment && (
                  <p>
                    <strong>Bạn:</strong> {previewComment}
                  </p>
                )}
              </form>
            )}
          </article>
          <div className="feed-bottom">
            <span>Hết tin tuyển dụng. Bắt đầu một chương mới.</span>
            <span>Hẹn gặp bạn ở lễ tốt nghiệp.</span>
          </div>
        </div>

        <aside className="right-column">
          <section className="panel event-card">
            <div className="event-heading">
              <span className="calendar-tile">
                <Icon name="calendar" size={22} />
              </span>
              <span>BUỔI ONBOARD ĐẶC BIỆT</span>
            </div>
            <h2>
              Lễ tốt nghiệp
              <br />
              của {details.graduate || "mình"}.
            </h2>
            <p className="event-subtitle">
              Một buổi lễ. Một tấm bằng.
              <br />
              Và những người mình muốn có mặt.
            </p>
            <div className="event-divider" />
            <dl>
              {eventRows.map((row) => (
                <div className="event-row" key={row.label}>
                  <Icon name={row.icon} size={18} />
                  <div>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="contract-tag">
              <span />
              Hợp đồng: Một ngày đáng nhớ
            </div>
            <button className="button outline" onClick={downloadCard} disabled={downloading}>
              <Icon name="download" size={16} />
              {downloading ? "Đang chuẩn bị…" : "Tải thiệp mời PNG"}
            </button>
            <p className="event-fineprint">
              Điền lịch trước khi gửi để ứng viên
              <br />
              không bị lạc vào một cuộc họp khác.
            </p>
          </section>
          <section className="panel benefits">
            <span className="section-overline">GÓI ĐÃI NGỘ CẠNH TRANH</span>
            <h3>Chúng tôi có gì?</h3>
            <div>
              <span className="benefit-number">01</span>
              <p>
                Môi trường trẻ trung.<small>Vì chưa ai chịu lớn.</small>
              </p>
            </div>
            <div>
              <span className="benefit-number">02</span>
              <p>
                Không OT, chỉ ÔT.<small>Ôm thắm thiết.</small>
              </p>
            </div>
            <div>
              <span className="benefit-number">03</span>
              <p>
                Văn hóa “như gia đình”.<small>Lần này là thật. Hứa.</small>
              </p>
            </div>
          </section>
          <p className="disclaimer">
            Thiệp parody, không liên kết với LinkedIn hoặc NVIDIA. Hình Jensen Huang là minh họa
            vui, không phải khách mời.
          </p>
        </aside>
      </main>

      {notice && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {notice}
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <section
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              className="close-button"
              onClick={() => setModal(false)}
              aria-label="Đóng"
            >
              <Icon name="close" />
            </button>
            <span className="section-overline">PHÒNG NHÂN SỰ XIN CHÀO</span>
            <h2 id="modal-title">Cá nhân hóa chiếc JD.</h2>
            <p className="modal-intro">Thông tin thật. Giọng văn hơi bất ổn.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setDetails(
                  Object.fromEntries(
                    Object.entries(draft).map(([key, value]) => [key, value.trim()]),
                  ) as typeof emptyDetails,
                );
                setMessage(draftMessage.trim());
                setModal(false);
                setNotice("Đã cập nhật thư mời. Sẵn sàng chiêu mộ hội bạn thân!");
              }}
            >
              <label htmlFor="graduate">Tên bạn (chủ xị lễ tốt nghiệp)</label>
              <input
                id="graduate"
                value={draft.graduate}
                maxLength={32}
                onChange={(event) => setDraft({ ...draft, graduate: event.target.value })}
                placeholder="Ví dụ: Nguyễn Minh Anh"
              />
              <label htmlFor="friend">
                Gửi riêng cho ai? <span>(không bắt buộc)</span>
              </label>
              <input
                id="friend"
                value={draft.friend}
                maxLength={32}
                onChange={(event) => setDraft({ ...draft, friend: event.target.value })}
                placeholder="Tên ứng viên bạn thân"
              />
              <div className="form-row">
                <div>
                  <label htmlFor="date">Ngày tốt nghiệp</label>
                  <input
                    id="date"
                    value={draft.date}
                    maxLength={40}
                    onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                    placeholder="Ví dụ: 20/06/2026"
                  />
                </div>
                <div>
                  <label htmlFor="time">Giờ có mặt</label>
                  <input
                    id="time"
                    value={draft.time}
                    maxLength={24}
                    onChange={(event) => setDraft({ ...draft, time: event.target.value })}
                    placeholder="Ví dụ: 09:00 sáng"
                  />
                </div>
              </div>
              <label htmlFor="venue">Địa điểm / chỗ hẹn</label>
              <input
                id="venue"
                value={draft.venue}
                maxLength={80}
                onChange={(event) => setDraft({ ...draft, venue: event.target.value })}
                placeholder="Tên trường, hội trường hoặc điểm hẹn"
              />
              <label htmlFor="message">Đôi lời từ ban lãnh đạo (là bạn)</label>
              <textarea
                id="message"
                rows={7}
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                maxLength={500}
                required
              />
              <span className="character-count">
                {draftMessage.length}/500 ký tự · Không cần xin duyệt sếp.
              </span>
              <button className="button primary modal-submit" type="submit">
                Duyệt và đăng thiệp <Icon name="check" size={17} />
              </button>
              <p className="modal-footnote">
                Chỉnh sửa chỉ áp dụng cho bản thiệp đang mở. Tải PNG để lưu và gửi bạn bè.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
