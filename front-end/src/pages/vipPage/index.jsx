import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Checkout from './paypal';
import { useUserStore } from '../../store';
import { useGetDetailUser } from '../../hook';
import avatar from '../../Image/avatar.png';
import payPalImg from '../../Image/paypal-256.png';
import vnpayImg from '../../Image/VNPay.webp';
import { useEffect, useState } from 'react';
import { Button, Flex, Radio, Tooltip } from 'antd';
import logoZB from '../../Image/logo_zb.svg';
import { useCreatePayment } from '../../mutationHook/payment';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
function VipPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const detaiUser = useGetDetailUser(user.id, user.accessToken);
  const [avatarImg, setAvatarImage] = useState(avatar);
  const payMent = useCreatePayment();
  const [payment, setPayment] = useState('paypal');
  const initialOptions = {
    'client-id': 'AdKx6DdHuGm2W8unKXOzMVOK56POhzKHqUUeVKww5IAKXxFPo3tJJHqBsY8pVC9P-imCxTHg7V-gObyq',
    currency: 'USD',
    intent: 'capture',
  };
  useEffect(() => {
    if (detaiUser.data?.data.image) {
      setAvatarImage(`${import.meta.env.VITE_API_FILE_URL}/${detaiUser.data?.data.image}`);
    }
  }, [detaiUser.data?.data.image]);
  const handlePay = () => {
    payMent.mutate({ amount: 499000, bankCode: 'VNBANK' });
  };
  useEffect(() => {
    if (payMent.isSuccess) {
      window.location.href = payMent.data?.path;
    }
  }, [payMent.isSuccess]);
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex items-center justify-between h-[71px] w-full px-[40px] border border-solid border-b-[#dfe2e7]">
        <img height={32} src={logoZB} />
        <div className="flex items-center">
          <img height={32} width={32} className="object-cover rounded-full" src={avatarImg} />
          <p className="text-[#222] text-[14px] ml-[12px]">{detaiUser.data?.data.fullName}</p>
          <Tooltip title={'Trở về'}>
            <button
              onClick={() => navigate('/')}
              className="text-[22px] text-[#222] cursor-pointer ml-[12px] rounded-full p-[16px] hover:bg-[#e7e3e3]"
            >
              <IoLogOutOutline />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className=" text-[#222] flex flex-1">
        {detaiUser.data?.data.vip ? (
          <div className="m-auto">Tài khoản này đã đăng ký premium</div>
        ) : (
          <div className="m-auto w-[1036px] flex gap-[24px] tablet:max-laptop:flex-col tablet:max-laptop:w-[620px]">
            <div className="w-[612px] flex flex-col gap-[16px]">
              <h2 className="text-[18px] font-semibold">Chọn phương thức thanh toán</h2>
              <Flex gap="middle" wrap vertical>
                <Button
                  onClick={() => setPayment('paypal')}
                  className={`h-[68px] w-full rounded-[4px] ${payment === 'paypal' && 'border-[#1677ff]'}`}
                  color="primary"
                  variant="outlined"
                >
                  <div className="h-full w-full flex items-center justify-between">
                    <p className="text-[#333] text-[16px] font-semibold">Thanh toán quốc tế qua Paypal</p>
                    <img height={32} width={32} className="object-cover" src={payPalImg} />
                  </div>
                </Button>
                <Button
                  onClick={() => setPayment('vnpay')}
                  className={`h-[68px] w-full rounded-[4px] ${payment === 'vnpay' && 'border-[#1677ff]'}`}
                  color="primary"
                >
                  <div className="h-full w-full flex items-center justify-between">
                    <p className="text-[#333] text-[16px] font-semibold">Thanh toán nội địa qua VNPay</p>
                    <img height={32} width={32} className="object-cover" src={vnpayImg} />
                  </div>
                </Button>
              </Flex>
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-semibold">Chi tiết giao dịch</h2>
              <div className="mt-[16px] px-[24px] py-[16px] flex justify-between items-center bg-[#f3f5f6]">
                <p className="font-semibold">Tài khoản mua dịch vụ</p>
                <div className="flex items-center gap-[12px]">
                  <p>{detaiUser.data?.data.fullName}</p>
                  <img className="object-cover rounded-full" height={36} width={36} src={avatarImg} />
                </div>
              </div>
              <div className="mt-[6px] px-[24px] py-[16px] mb-[24px] text-[14px] bg-[#f3f5f6]">
                <h2 className="text-[18px] font-semibold">Sản phẩm</h2>
                <div className="flex items-center justify-between mt-[12px]">
                  {/* <p>Zing MP3 Premium</p> */}
                  <p>Tài khoản premium</p>
                  <p className="font-bold">{payment === 'paypal' ? '19.67 USD' : '499.000đ'}</p>
                </div>
                <p className="text-[#476285] text-[13px] mt-[4px]">Thời gian hiệu lưc vĩnh viễn</p>
                <div className="pt-[16px] mt-[12px] border-t-[1px] border-bg-[#dfe2e7] flex justify-between">
                  <h2 className="text-[18px] font-semibold">Tổng tiền</h2>
                  <div className="text-right text-[24px]">
                    <p className="font-bold ">{payment === 'paypal' ? '19.67 USD' : '499.000đ'}</p>
                    <p className="text-[#476285] text-[13px]">Đã bao gồm VAT và phí liên quan</p>
                  </div>
                </div>
              </div>
              {payment === 'paypal' ? (
                <PayPalScriptProvider options={initialOptions}>
                  <Checkout />
                </PayPalScriptProvider>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button className="font-semibold h-[45px] text-[16px]" onClick={handlePay} type="primary">
                    Tiếp tục thanh toán
                  </Button>
                  <Button className="font-semibold h-[45px] text-[16px]" type="text">
                    Hủy giao dịch
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default VipPage;
