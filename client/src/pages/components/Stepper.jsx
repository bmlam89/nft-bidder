import { useLocation } from 'react-router-dom';

const Stepper = () => {
  const location = useLocation();

  const steps = [
    { id: '01', name: 'Setup', href: '#', status: 'current' },
    { id: '02', name: 'Review', href: '#', status: 'upcoming' },
    { id: '03', name: 'Sweep', href: '#', status: 'upcoming' },
  ]
  let classNames = {
    '/sweeper': ['border-cyan-900 bg-cyan-300 text-slate-900', 'border-slate-500 text-slate-500', 'border-slate-500 text-slate-500'],
    '/sweeper/review':['border-cyan-600 text-cyan-400','border-cyan-900 bg-cyan-300 text-slate-900', 'border-slate-500 text-slate-500'],
    '/sweeper/confirm':['border-cyan-600 text-cyan-400', 'border-cyan-600 text-cyan-400', 'border-cyan-900 bg-cyan-300 text-slate-900'],
    '/sweeper/complete':['border-cyan-600 text-cyan-400', 'border-cyan-600 text-cyan-400', 'border-cyan-600 text-cyan-400']
  }
  
  return (
    <nav 
      aria-label="Progress"
      className='flex w-full h-12 px-3 '
      key='stepper-wrapper'
    >
      <ol className='flex w-full h-full items-center'>
        { steps.map((step,idx) => 
          <li 
            className={ `flex basis-1/3 h-full justify-center items-center border rounded 
            ${classNames[location.pathname][idx]}` }
            key={ `stepper-li-${idx}` }
          >
            <span className='flex'>
              <p className='text-base'>
                {idx+1}. { `${step.name}` }
              </p>
            </span>
          </li>
        )}
      </ol>
    </nav>
  )
};

export default Stepper;

/* This example requires Tailwind CSS v2.0+ */




  






  

