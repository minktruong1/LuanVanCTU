import icons from "./icons";

const { AiOutlineStar, AiFillStar, MdOutlineStarHalf } = icons;

export const slugifyByHand = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

export const formatVND = (number) =>
  Number(number?.toFixed(1)).toLocaleString();

export const pointToStar = (number) => {
  const stars = [];

  // Số sao nguyên
  const integerStars = Math.floor(number);

  // Đổ sao nguyên
  for (let i = 0; i < integerStars; i++) {
    stars.push(<AiFillStar color="yellow" />);
  }

  // Nếu có số thập phân và còn chỗ trống, đổ thêm một sao màu vàng
  if (number !== integerStars && stars.length < 5) {
    stars.push(<MdOutlineStarHalf color="yellow" />);
  }

  // Đổ sao trống cho số điểm còn thiếu
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<AiOutlineStar color="yellow" />);
  }

  return stars;
};

export const timeExchange = (d) => {
  d = Number(d) / 1000;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  return { h, m, s };
};
