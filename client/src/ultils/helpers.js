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
    stars.push(<AiFillStar color="#ff8a00" />);
  }

  // Nếu có số thập phân và còn chỗ trống, đổ thêm 1/2 sao màu vàng
  if (number !== integerStars && stars.length < 5) {
    stars.push(<MdOutlineStarHalf color="#ff8a00" />);
  }

  // Đổ sao trống cho số điểm còn thiếu
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<AiOutlineStar color="#ff8a00" />);
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

export const formValidate = (payload, setInvalidFields) => {
  let invalids = 0;

  const formatPayload = Object.entries(payload);
  for (let array of formatPayload) {
    if (array[1].trim() === "") {
      invalids++;
      setInvalidFields((previous) => [
        ...previous,
        { name: array[0], message: "Vui lòng nhập" },
      ]);
    }
  }
  for (let array of formatPayload) {
    switch (array[0]) {
      case "email":
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!array[1].match(regex)) {
          invalids++;
          setInvalidFields((previous) => [
            ...previous,
            { name: array[0], message: "Email không hợp lệ" },
          ]);
        }
        break;
      case "password":
        if (array[1].length < 8) {
          invalids++;
          setInvalidFields((previous) => [
            ...previous,
            { name: array[0], message: "Mật khẩu phải 8 ký tự trở lên" },
          ]);
        }
        break;

      default:
        break;
    }
  }
  return invalids;
};

export const listPageRange = (start, end) => {
  const length = end + 1 - start;

  return Array.from({ length }, (_, index) => start + index);
};

// export const fileToBase64 = (filename, filepath) => {
//   return new Promise((resolve) => {
//     var file = new File([filename], filepath);
//     var reader = new FileReader();
//     reader.onload = function (event) {
//       resolve(event.target.result);
//     };
//     reader.readAsDataURL(file);
//   });
// };

export function getBase64(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
