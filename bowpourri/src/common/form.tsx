import { Controller } from 'react-hook-form';

export const TextInput = ({
    label,
    name,
    control,
    required = False,
    readOnly = false,
}) => (
    <label>
        {label}
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <div>
                        <input
                            {...field}
                            readOnly={readOnly}
                            required={required}
                            className='input input-bordered w-full max-w-xs'
                        />
                        {error && (
                            <p className='text-red-500'>{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    </label>
);

export const CheckboxInput = ({
    label,
    name,
    control,
    required = false,
    readOnly = false,
}) => (
    <label>
        {label}
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input
                    {...field}
                    readOnly={readOnly}
                    required={required}
                    className='checkbox checkbox-primary'
                />
            )}
        />
    </label>
);

export const RadioInput = ({
    label,
    name,
    control,
    required = false,
    readOnly = false,
}) => (
    <label>
        {label}
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input
                    {...field}
                    readOnly={readOnly}
                    required={required}
                    className='radio radio-primary'
                />
            )}
        />
    </label>
);