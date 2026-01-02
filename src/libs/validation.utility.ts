/* eslint-disable no-nested-ternary */
import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

import type { MIME_TYPE } from './mime';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

export function asOptionalField<T extends ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

// export const numberRequired = z
//   .number({ required_error: 'This is a required field' })
//   .or(z.string().transform(Number))
//   .refine((data: any) => {
//     if (!data || data === '') return false;
//     return true;
//   }, 'This is a required field')
//   .refine((data) => {
//     if (Number.isNaN(Number(data))) return false;
//     return true;
//   }, 'invalid number');

export function asStringRequired<T extends ZodTypeAny>(schema?: T) {
  return (schema ?? z.string()).refine(
    (u) => {
      const str = u.trim().replace(/\s\s+/g, ' ');
      return str === '' ? false : str;
    },
    {
      params: {
        i18n: 'errors.invalid_type_received_undefined',
      },
    }
  );
}

export function stringRefine<T extends ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

// const withFileString = (file: any) => (typeof file === 'string' ? true : file);

export const zFileValidator = (size: number, fileType: MIME_TYPE[], isRequired = true) => {
  return isRequired
    ? z
        .any()
        .refine((file) => Boolean(file), {
          params: { i18n: 'errors.invalid_type_received_undefined' },
        })
        .refine((file) => (typeof file === 'string' ? true : file?.size <= size), {
          params: {
            i18n: { key: 'errors.max_file_size', values: { maximum: '5MB' } },
          },
        })
        .refine((file) => (typeof file === 'string' ? true : fileType.includes(file?.type)), {
          params: {
            i18n: {
              key: 'errors.file_type_accepted',
              values: { fileType: fileType.join(', ') },
            },
          },
        })
    : z
        .any()
        .optional()
        .refine((file) => (typeof file === 'string' ? true : file ? file?.size <= size : true), {
          params: {
            i18n: { key: 'errors.max_file_size', values: { maximum: '5MB' } },
          },
        })
        .refine((file) => (typeof file === 'string' ? true : file ? fileType.includes(file?.type) : true), {
          params: {
            i18n: {
              key: 'errors.file_type_accepted',
              values: { fileType: fileType.join(', ') },
            },
          },
        });
};

export const twitterUrlRegex = /^https?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]{1,15})$/;

export const facebookUrlRegex = /^https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_]{1,})$/;

export const validationMessages = {
  required: (field?: string) => 'Trường này là bắt buộc!',
  number: (field?: string) => (field ? `${field} phải là một số!` : 'Trường này phải là một số!'),
  between: (min: number, max: number, field?: string) =>
    field
      ? `Giá trị của ${field.toLowerCase()} phải nằm trong khoảng từ ${min} đến ${max} ký tự`
      : `Giá trị phải nằm trong khoảng từ ${min} đến ${max} ký tự`,
  max: (max: number, field?: string) => `Giá trị nhập vào không được vượt quá ${max} ký tự!`,
  gt: (min: number, field?: string) => (field ? `${field} phải có ít nhất ${min} ký tự` : `Trường này phải có ít nhất ${min} ký tự`),
  gte: (min: number, field?: string) => (field ? `${field} phải lớn hơn hoặc bằng ${min}` : `Giá trị phải lớn hơn hoặc bằng ${min}`),
  lt: (max: number, field?: string) => (field ? `${field} phải nhỏ hơn ${max}` : `Giá trị phải nhỏ hơn ${max}`),
  lte: (max: number, field?: string) => (field ? `${field} phải nhỏ hơn hoặc bằng ${max}` : `Giá trị phải nhỏ hơn hoặc bằng ${max}`),
  specialCharacters: () => "Trường này chỉ được chứa các ký tự đặc biệt sau: '-', '_', ' '. Không được phép dùng ký tự đặc biệt khác.",
  emoji: () => 'Không được phép sử dụng emoji khác.',
  invalid: (field?: string) => (field ? `${field} không hợp lệ` : 'Giá trị không hợp lệ'),
};
