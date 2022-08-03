import { useState } from 'react';


const Input = (props) => {
  const [input, setInput] = useState(props.state);
  const handleChange = (event) => {
    props.setState(event.target.value);
    setInput(event.target.value);
  }
  return (
    <div className={props.wrapperClassname}>
      <label 
        htmlFor={ `${props.htmlForNameId}` }
        className={ `flex text-sm text-slate-200 ${props.labelClassname}` }
      >
        {props.fieldName}
      </label>
      <div className={ `mt-1 ` }>
        <input
          type={ `${props.inputType}` }
          name={ `${props.htmlForNameId}` }
          id={ `${props.htmlForNameId}` }
          className="text-slate-50 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm 
          border-slate-300 rounded-md bg-slate-900 py-0.5 truncate pr-5"
          placeholder={ `${props.inputPlaceholder ? props.inputPlaceholder : ''}` }
          aria-describedby={ `${props.htmlForNameId}` }
          value={ `${input}` }
          onChange={(event) => handleChange(event)}
        />
      </div>
    </div>
  )
};

export default Input;
