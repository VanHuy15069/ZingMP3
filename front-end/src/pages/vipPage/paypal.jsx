import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Spin } from 'antd';
import { useUpgradeAccount } from '../../mutationHook/user';
import { useUserStore } from '../../store';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [{ isPending }] = usePayPalScriptReducer();
  const upgradeAccount = useUpgradeAccount();
  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '19.67',
            currency_code: 'USD',
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      upgradeAccount.mutate({ id: user.id, accessToken: user.accessToken });
    });
  };

  useEffect(() => {
    if (upgradeAccount.isSuccess) {
      Swal.fire({
        title: 'Success!',
        text: 'Nâng cấp tài khoản thành công!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Trở về',
        customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
    }
  }, [upgradeAccount.isSuccess]);

  return (
    <div>
      {isPending ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApproveOrder(data, actions)}
            onError={(e) => console.log('haha', e)}
          />
        </>
      )}
    </div>
  );
};

export default Checkout;
