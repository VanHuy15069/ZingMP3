import { Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetVNPayReturn } from '../../hook';
import { useEffect } from 'react';
import { useUpgradeAccount } from '../../mutationHook/user';
import { useUserStore } from '../../store';

function GetOrder() {
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const user = useUserStore((state) => state.user);
  const queries = {
    vnp_Amount: param.get('vnp_Amount'),
    vnp_BankCode: param.get('vnp_BankCode'),
    vnp_BankTranNo: param.get('vnp_BankTranNo'),
    vnp_CardType: param.get('vnp_CardType'),
    vnp_OrderInfo: param.get('vnp_OrderInfo'),
    vnp_PayDate: param.get('vnp_PayDate'),
    vnp_ResponseCode: param.get('vnp_ResponseCode'),
    vnp_TmnCode: param.get('vnp_TmnCode'),
    vnp_TransactionNo: param.get('vnp_TransactionNo'),
    vnp_TransactionStatus: param.get('vnp_TransactionStatus'),
    vnp_TxnRef: param.get('vnp_TxnRef'),
    vnp_SecureHash: param.get('vnp_SecureHash'),
  };
  const getOrder = useGetVNPayReturn(queries);
  const upgradeAccount = useUpgradeAccount();
  useEffect(() => {
    if (getOrder.isSuccess && getOrder.data?.status === 'SUCCESS' && getOrder.data?.code === '00') {
      upgradeAccount.mutate({ id: user.id, accessToken: user.accessToken });
    }
  }, [getOrder.isSuccess]);

  return (
    <div className="min-h-screen bg-white text-[#333] flex">
      <div className="m-auto text-center">
        <p className="text-[20px] mb-[12px]">
          {getOrder.isSuccess && getOrder.data?.status === 'SUCCESS' && getOrder.data?.code === '00'
            ? 'Tài khoản của quý khách đã được nâng cấp'
            : 'Giao dịch thất bại'}
        </p>
        <Button onClick={() => navigate('/upgrade-account')}>Quay về</Button>
      </div>
    </div>
  );
}

export default GetOrder;
