/**
 * CẤU HÌNH ĐƯỜNG DẪN 11 ẢNH, 2 VIDEO, NHẠC VÀ FILE BỨC THƯ
 * - Thay link ảnh bằng đường link ảnh của bạn (https://...) trong PHOTO_LINKS.
 * - Thay link video trong VIDEO_LINKS.
 * - Thay link nhạc bằng đường link MP3 hoặc YouTube trong MUSIC_LINK.
 * - Sửa nội dung bức thư trực tiếp trong file /public/letter.txt.
 */

export interface MemoryPhoto {
  id: string;
  url: string;
}

/**
 * Danh sách 11 link ảnh kỉ niệm (có thể thay bằng bất kỳ link ảnh https://... nào).
 */
export const PHOTO_LINKS: MemoryPhoto[] = [
  {
    id: 'photo-01',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-05d6781d-bebd-4ca9-ba1d-60a36b529e1a.jpg',
  },
  {
    id: 'photo-02',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-91262f03-cad0-43a0-81c6-ade4d8c829d8.jpg',
  },
  {
    id: 'photo-03',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-a4ee408a-e549-4a8f-9c86-99631eb8b8d3.jpg',
  },
  {
    id: 'photo-04',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-f8e29f22-5753-4797-ac5d-7d0722885cc0.jpg',
  },
  {
    id: 'photo-05',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-8adfbba6-b54c-49a5-ad3e-bb29bcaaf006.jpg',
  },
  {
    id: 'photo-06',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-d525a5e4-a674-4ea8-9683-dc2704b57181.jpg',
  },
  {
    id: 'photo-07',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-d7b72e9a-bc12-4651-8fde-c512a04a1d88.jpg',
  },
  {
    id: 'photo-08',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-23800717-7c24-4b30-978e-f44cdefa2944.jpg',
  },
  {
    id: 'photo-09',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-6c3fcff6-77d8-467a-a3ff-4deaca25fba5.jpg',
  },
  {
    id: 'photo-10',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-c721bf4a-ca9c-46ba-84ed-85d7e37fa26d.jpg',
  },
  {
    id: 'photo-11',
    url: 'https://cdn.phototourl.com/anon/2026-11-19-6ba9af4b-cd97-4b65-9512-70a95f38f61a.jpg',
  },
];

export interface VideoItem {
  id: string;
  title: string;
  caption: string;
  url: string;
}

/**
 * Danh sách 2 video hiển thị ở trang video cuối thư.
 * Hỗ trợ cả link video trực tiếp (.mp4/.webm) lẫn link YouTube (https://youtu.be/... hoặc youtube.com/watch?v=...).
 */
export const VIDEO_LINKS: VideoItem[] = [
  {
    id: 'video-01',
    title: 'Video 1 · Khoảnh khắc đáng nhớ',
    caption: 'Thước phim kỉ niệm đầu tiên dành tặng ngày 19/11.',
    url: 'https://powerful-tan-akfhgosg.edgeone.dev/',
  },
  {
    id: 'video-02',
    title: 'Video 2 · Lời chúc gửi bạn',
    caption: 'Thước phim thứ hai — chúc bạn luôn vững vàng và bình an.',
    url: 'https://miserable-beige-swbf7d3n.edgeone.dev/',
  },
];

/**
 * Đường dẫn link nhạc nền (MP3 / Audio URL / YouTube URL).
 */
export const MUSIC_LINK =
  'https://youtu.be/YXkp77tR9vw?si=uZaWTxU_anUw7XZi';

/**
 * Đường dẫn trỏ tới file bức thư riêng (/public/letter.txt).
 */
export const LETTER_FILE_PATH = '/letter.txt';
