import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { VscChevronDown } from 'react-icons/vsc';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ComboSelect = (props) => {
  const [query, setQuery] = useState('');
  
  const [selectedOption, setSelectedOption] = useState(props.options[0]);
  const [current, setCurrent] = useState(props.options[0].value);
  const handleChange = (option) => {
    setCurrent(option.value);
    setSelectedOption(option);
    props.setState(option);
  };

  const filteredOptions = 
    query === ''
    ? props.options
    : props.options.filter((option) => {
      return option.value.toLowerCase().includes(query.toLowerCase())
    })
  
  return (
    <Combobox 
      as="div" 
      value={ selectedOption } 
      onChange={(option) => handleChange(option)}
      className={ `${props.wrapperClassname}` }
    >
      <Combobox.Label className={ `block text-sm ${props.labelClassname}` }>{props.fieldName}</Combobox.Label>
      <div className={ `relative mt-1 ${props.innerWrapperClassname}` }>
        <Combobox.Input
          className={ `flex place-self-end text-left w-full rounded-md border border-slate-50 py-0.5 
           focus:outline-none sm:text-xs ${props.inputClassname} line-clamp-1 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500` }
          onChange={(event) => setQuery(event.target.value)}
          displayValue={ (option) => option.value }
       />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <VscChevronDown className="h-5 w-5 " aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options 
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 
            text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                className={
                  classNames(
                    'relative flex flex-col py-3 gap-x-2 px-4 cursor-default select-none border-b border-slate-50 items-start justify-start',
                    option.value === current ? 'bg-cyan-600' : ''
                  )
                }
              >
                <div className="flex w-full h-full">
                  <span className='ml-3 basis-2/3 truncate h-full'>{option.value}</span>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
};

export default ComboSelect;