import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Combobox } from '@headlessui/react';
import { VscChevronDown } from 'react-icons/vsc';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const MultiComboSelect = (props) => {
  const user = useUser();
  const [config, setConfig] = useState(props.config);
  const [placeHolder, setPlaceholder] = useState(props.config.current.name);
  const handleFormUpdate = (option) => {
    if(!user.currentAccount.address) window.location.replace('http://localhost:3000/');

    let id = props.id;
    let field = props.config.field;
    let configs = props.configs;
    option.active = !option.active;
    option.configId = id;
    
    let placeHolder = config.current.value.filter(collection => collection.active === true).map(collection => collection.name).join(', ');
    config.current.name = placeHolder;
    configs[id][field] = config;
    setConfig(config);
    setPlaceholder(placeHolder);
    props.stateHandler(configs);
  }

  return (
    <>
    { config && <Combobox 
      as="div" 
      value={ placeHolder } 
      onChange={(option) => handleFormUpdate(option)}
      className={ `${props.wrapperClassname}` }
    >
      <Combobox.Label className={ `block text-sm ${props.labelClassname}` }>{ config.label }</Combobox.Label>
      <div className={ `relative mt-1 ${props.innerWrapperClassname}` }>
        <Combobox.Input
          className={ `flex place-self-end text-left  w-full rounded-md border border-slate-300 py-0.5 pr-12
           focus:outline-none sm:text-xs ${props.inputClassname} truncate shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500` }
           displayValue={ config.current.name }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <VscChevronDown className="h-5 w-5 " aria-hidden="true" />
        </Combobox.Button>

        {config.current.value && (
          <Combobox.Options 
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 
            text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {config.current.value.map((option,idx) => (
              <Combobox.Option
                key={ `multi-option-${idx}` }
                value={option}
                className={
                    'relative flex flex-col py-3 gap-x-2 px-4 cursor-default select-none border-b border-slate-50 items-start justify-start '
                    + option.active === true ? 'bg-cyan-600 text-slate-50' : ''
                }
              >
                <div className="flex w-full h-full">
                  <img src={option.imageUrl} alt="eth-logo" className="h-7 w-7 flex-shrink-0 rounded-full"/>
                  <span className='ml-3 basis-2/3 truncate h-full'>{option.name}</span>
                  <span className='flex basis-1/3 items-start justify-end'>
                    <img src={ option.ethImageUrl } className='w-6 h-5'/>
                    <p>{ +option.floorPrice.toFixed(2) }</p>
                  </span>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  } </> 
  )
};

export default MultiComboSelect;