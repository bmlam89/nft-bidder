import { Fragment, useState, useEffect, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck } from 'react-icons/hi';
import { VscChevronDown } from 'react-icons/vsc';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const isActive = (currentConfig, option) => {
  if(currentConfig.current.name === option.name) return true;
  else return false;
}
const Select = (props) => {
  const user = useUser();
  const [config, setConfig] = useState(props.config);
  const handleFormUpdate = (option) => {
    let id = props.id;
    let field = props.config.field;
    option.active = true;
    let configs = props.configs;
    let currentConfig = config;
    currentConfig.current = option;
    configs[id][field] = currentConfig;
    setConfig(currentConfig);
    props.stateHandler(configs);
  }
  
  return (
    <Listbox value={config.current} onChange={(option) => handleFormUpdate(option)}>
      {({ open }) => (
        <div className={ `flex flex-col items-end ${props.config.id}` }>
          <Listbox.Label className={ `block text-sm font-medium ${props.labelClassname}` }>
            { props.config.label }
          </Listbox.Label>
          <div className={ `mt-1 relative ${props.wrapperClassname}` }>
            <Listbox.Button 
              className={ `relative w-full border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-0.5 text-left 
              cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 
              sm:text-sm ${props.inputclassName}` }
            >
              <span className="block truncate">{config.current.name}</span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <VscChevronDown className="h-5 w-5 " aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options 
                className="absolute z-10 mt-1 w-full shadow-lg max-h-60 rounded-md py-1 text-base 
                ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm hSlider"
              >
                {props.config.selectOptions.map((option,idx) => (
                  <Listbox.Option
                    key={ `list-${idx}-${props.label}` }
                    className={`cursor-default select-none relative py-2 pl-8 pr-4 `+
                      isActive(config, option) ? 'text-white bg-cyan-600' : ''
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${isActive(config, option) ? 'font-semibold' : 'font-normal'}`}>
                          {option.name}
                        </span>

                        {false && isActive(config, option) ? (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center px-2 `+
                            isActive(config, option) ? 'text-white' : 'text-cyan-600'}
                          >
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          </div>
      )}
    </Listbox>
  )
}
export default Select;