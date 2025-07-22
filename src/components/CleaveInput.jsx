import { useRef, useEffect } from 'react';
import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.ru';

function CleaveInput({ value, onChange, className, placeholder, required }) {
  const inputRef = useRef(null);
  const cleaveInstance = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

    cleaveInstance.current = new Cleave(inputRef.current, {
      phone: true,
      phoneRegionCode: 'RU',
      prefix: '+7',
      noImmediatePrefix: false,
      delimiters: [' ', ' ', ' '],
      blocks: [3, 3, 2, 2],
      numericOnly: true,
      onValueChanged: (e) => {
        onChange({ target: { value: e.target.value } });
      },
    });

    return () => {
      cleaveInstance.current?.destroy();
    };
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      required={required}
    />
  );
}

export default CleaveInput;