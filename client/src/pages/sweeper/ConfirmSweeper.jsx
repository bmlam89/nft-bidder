
import { Input } from '../index';
import { useUser } from '../../context/UserContext';

const Confirm = () => {
  const user = useUser();

  return (
    <div className="px-6 py-6 border-b border-slate-700 text-left" key='review-collections-wrapper'>
      { user.currentAccount.address && <main className='flex flex-col gap-y-5'>
        <div className='flex flex-col gap-y-3'>
          <p className='text-base text-slate-50'>
            For final confirmation, please make sure you understand the following.
          </p>
        </div>
        <ol className='list-decimal list-outside leading-10'>
            <li>
              <p className='leading-snug'>
                The sweeper will send out offers using your bid wallet.
              </p>
            </li>
            <li>
              <p className='leading-snug'>
                You can choose to have successful purchases automatically listed.
              </p>
            </li>
            <li>
              <p className='leading-snug'>If it's bought by another user, the funds will then 
                be sent over to your main wallet where we don't have access to any sensitive information.
              </p>
            </li>
            <li>
              <p className='leading-snug'>
                For unsuccessful bids, the bid amount will be automatically sent back to your main wallet.
              </p>
            </li>
          </ol>
      </main> }
    </div> 
  );
};

export default Confirm;