import React from "react";
import FaqQuestion from "../../components/FaqQuestion";
import { Breadcrumb } from "../../components";
import { Helmet } from "react-helmet";

const content = [
  {
    id: 1,
    question: "Có các vấn đề gì khi vận chuyển không?",
    answer:
      "Khi vận chuyển có thể xảy ra một số vấn đề như mất hàng, hỏng hóc hoặc giao hàng trễ. Chúng tôi cam kết sẽ làm hết khả năng để giải quyết mọi vấn đề liên quan đến vận chuyển và đảm bảo bạn nhận được sản phẩm trong tình trạng hoàn hảo.",
  },
  {
    id: 2,
    question: "Sau khi đặt hàng, tôi phải làm gì nữa?",
    answer:
      "Sau khi đặt hàng thành công, bạn sẽ nhận được một email xác nhận đơn hàng. Chúng tôi sẽ tiến hành xử lý đơn hàng của bạn và thông báo cho bạn về tình trạng giao hàng. Bạn có thể theo dõi tình trạng đơn hàng của mình thông qua trang web hoặc ứng dụng di động của chúng tôi.",
  },
  {
    id: 3,
    question: "Tôi phải làm gì để tránh bị khóa tài khoản?",
    answer:
      "Để tránh bị khóa tài khoản, bạn cần tuân theo các quy tắc và điều khoản của chúng tôi. Đảm bảo rằng bạn không vi phạm bất kỳ quy định nào, và thực hiện đúng các hướng dẫn về sử dụng tài khoản của bạn. Nếu bạn gặp bất kỳ vấn đề hoặc có câu hỏi, vui lòng liên hệ với dịch vụ khách hàng của chúng tôi để được hỗ trợ.",
  },
  {
    id: 4,
    question: "Tôi muốn góp ý cho website thì làm thế nào?",
    answer:
      "Chúng tôi luôn hoan nghênh mọi ý kiến đóng góp từ khách hàng. Để góp ý hoặc báo lỗi trên website, bạn có thể sử dụng tính năng phản hồi trên trang web của chúng tôi hoặc liên hệ với dịch vụ khách hàng. Ý kiến của bạn sẽ giúp chúng tôi cải thiện trải nghiệm của tất cả khách hàng.",
  },
  {
    id: 5,
    question: "Làm gì để thanh toán online?",
    answer:
      "Để thanh toán online, bạn có thể chọn phương thức thanh toán trực tuyến như thẻ tín dụng, thẻ ghi nợ hoặc các hình thức thanh toán điện tử khác mà chúng tôi hỗ trợ. Khi thanh toán, hãy cung cấp thông tin thanh toán chính xác và theo dõi tình trạng thanh toán của bạn. Chúng tôi đảm bảo rằng quá trình thanh toán của bạn là an toàn và bảo mật.",
  },
];

const Faqs = () => {
  window.scrollTo(0, 0);

  return (
    <div className="w-[calc(100%-20px)] md:w-main ">
      <Breadcrumb />
      <div className="p-6 bg-white rounded">
        <div className="flex justify-center text-2xl mb-4">
          Các câu hỏi thường gặp
        </div>
        <div>
          {content?.map((element) => (
            <FaqQuestion ques={element.question} answer={element.answer} />
          ))}
        </div>
      </div>
      <Helmet>
        <title>Giải đáp thắc mắc</title>
      </Helmet>
    </div>
  );
};

export default Faqs;
