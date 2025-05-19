'use client';

import { FC } from 'react';
import { X, Check, AlertCircle, Search } from 'lucide-react';

interface FieldConfig {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'checkbox' | 'select' ;
  status?: 'default' | 'error' | 'success';
  helpText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  showClear?: boolean;
  showIconButton?: boolean;
}

interface DynamicModalFormProps {
  title: string;
  fields: FieldConfig[];
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => void;
}

export const DynamicModalForm: FC<DynamicModalFormProps> = ({
  title,
  fields,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = Object.fromEntries(
              new FormData(e.currentTarget).entries()
            );
            onSubmit(formData as Record<string, string>);
          }}
          className="space-y-4"
        >
          {fields.map((field) => {
            const baseClass =
              'w-full px-3 py-2 rounded border outline-none transition-all focus:ring-2';
            const statusClasses =
              field.status === 'error'
                ? 'border-red-500 focus:ring-red-300'
                : field.status === 'success'
                ? 'border-green-500 focus:ring-green-300'
                : 'border-gray-300 focus:ring-blue-300';

            return (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={field.id}
                  className="text-xs text-gray-500 font-medium"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.id}
                    name={field.id}
                    defaultValue={field.value}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className={`${baseClass} ${statusClasses} pr-10`}
                  />

                  {/* Right Icons */}
                  {field.showClear && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => {
                        const input = document.getElementById(
                          field.id
                        ) as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}

                  {field.status === 'success' && (
                    <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}

                  {field.status === 'error' && (
                    <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                  )}

                  {field.showIconButton && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Search className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Help / Error Message */}
                {field.helpText && (
                  <p
                    className={`text-xs mt-1 ${
                      field.status === 'error'
                        ? 'text-red-500'
                        : field.status === 'success'
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {field.helpText}
                  </p>
                )}

                {/* Character Counter */}
                {field.showCharCount && field.maxLength && (
                  <div className="text-xs text-right text-gray-400">
                    {field.value?.length ?? 0}/{field.maxLength}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
