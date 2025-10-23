'use client';
import { createIcon, IPrimitiveIcon, PrimitiveIcon, Svg } from '@gluestack-ui/icon';
import { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import React from 'react';
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export const UIIcon = createIcon({
  Root: PrimitiveIcon,
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
  React.RefAttributes<React.ComponentRef<typeof Svg>>
>;

const iconStyle = tva({
  base: 'text-typography-950 fill-none pointer-events-none',
  variants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
      '2xl': 'h-16 w-16'
    },
  },
});

cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

type IIConProps = IPrimitiveIcon &
  VariantProps<typeof iconStyle> &
  React.ComponentPropsWithoutRef<typeof UIIcon>;

const Icon = React.forwardRef<React.ComponentRef<typeof UIIcon>, IIConProps>(
  function Icon({ size = 'md', className, ...props }, ref) {
    if (typeof size === 'number') {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
          size={size}
        />
      );
    } else if (
      (props.height !== undefined || props.width !== undefined) &&
      size === undefined
    ) {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
        />
      );
    }
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={iconStyle({ size, class: className })}
      />
    );
  }
);

export { Icon };

type ParameterTypes = Omit<Parameters<typeof createIcon>[0], 'Root'>;

const createIconUI = ({ ...props }: ParameterTypes) => {
  const UIIconCreateIcon = createIcon({
    Root: Svg,
    ...props,
  }) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
    React.RefAttributes<React.ComponentRef<typeof Svg>>
  >;

  return React.forwardRef<React.ComponentRef<typeof Svg>>(function UIIcon(
    {
      className,
      size,
      ...inComingProps
    }: VariantProps<typeof iconStyle> &
      React.ComponentPropsWithoutRef<typeof UIIconCreateIcon>,
    ref
  ) {
    return (
      <UIIconCreateIcon
        ref={ref}
        {...inComingProps}
        className={iconStyle({ size, class: className })}
      />
    );
  });
};
export { createIconUI as createIcon };
// All Icons
const AddIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 5V19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

AddIcon.displayName = 'AddIcon';
export { AddIcon };

const AlertCircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

AlertCircleIcon.displayName = 'AlertCircleIcon';
export { AlertCircleIcon };

const ArrowUpIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 19V5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12L12 5L19 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowDownIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 5V19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 12L12 19L5 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowRightIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 5L19 12L12 19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowLeftIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M19 12H5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19L5 12L12 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ArrowUpIcon.displayName = 'ArrowUpIcon';
ArrowDownIcon.displayName = 'ArrowDownIcon';
ArrowRightIcon.displayName = 'ArrowRightIcon';
ArrowLeftIcon.displayName = 'ArrowLeftIcon';

export { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon };

const AtSignIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <>
        <Path
          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 7.99999V13C16 13.7956 16.3161 14.5587 16.8787 15.1213C17.4413 15.6839 18.2044 16 19 16C19.7957 16 20.5587 15.6839 21.1213 15.1213C21.6839 14.5587 22 13.7956 22 13V12C21.9999 9.74302 21.2362 7.55247 19.8333 5.78452C18.4303 4.01658 16.4706 2.77521 14.2726 2.26229C12.0747 1.74936 9.76794 1.99503 7.72736 2.95936C5.68677 3.92368 4.03241 5.54995 3.03327 7.57371C2.03413 9.59748 1.74898 11.8997 2.22418 14.1061C2.69938 16.3125 3.90699 18.2932 5.65064 19.7263C7.39429 21.1593 9.57144 21.9603 11.8281 21.9991C14.0847 22.0379 16.2881 21.3122 18.08 19.94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    </>
  ),
});

AtSignIcon.displayName = 'AtSignIcon';

export { AtSignIcon };

const BellIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

BellIcon.displayName = 'BellIcon';

export { BellIcon };

const CalendarDaysIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 2V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 10H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14H8.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 14H16.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 18H8.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 18H16.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CalendarDaysIcon.displayName = 'CalendarDaysIcon';

export { CalendarDaysIcon };

const CheckIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M20 6L9 17L4 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const CheckCircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CheckIcon.displayName = 'CheckIcon';
CheckCircleIcon.displayName = 'CheckCircleIcon';

export { CheckCircleIcon, CheckIcon };

const ChevronUpIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  d: 'M12 10L8 6L4 10',
  path: (
    <>
      <Path
        d="M18 15L12 9L6 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronDownIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M6 9L12 15L18 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronLeftIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M15 18L9 12L15 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronRightIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M9 18L15 12L9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsLeftIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M11 17L6 12L11 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 17L13 12L18 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsRightIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M13 17L18 12L13 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 17L11 12L6 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsUpDownIcon = createIcon({
  Root: Svg,

  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M7 15L12 20L17 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 9L12 4L17 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ChevronUpIcon.displayName = 'ChevronUpIcon';
ChevronDownIcon.displayName = 'ChevronDownIcon';
ChevronLeftIcon.displayName = 'ChevronLeftIcon';
ChevronRightIcon.displayName = 'ChevronRightIcon';
ChevronsLeftIcon.displayName = 'ChevronsLeftIcon';
ChevronsRightIcon.displayName = 'ChevronsRightIcon';
ChevronsUpDownIcon.displayName = 'ChevronsUpDownIcon';

export {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon, ChevronUpIcon
};

const CircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CircleIcon.displayName = 'CircleIcon';

export { CircleIcon };

const ClockIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6V12L16 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ClockIcon.displayName = 'ClockIcon';

export { ClockIcon };

const CloseIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M18 6L6 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const CloseCircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 9L9 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9L15 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CloseIcon.displayName = 'CloseIcon';
CloseCircleIcon.displayName = 'CloseCircleIcon';

export { CloseCircleIcon, CloseIcon };

const CopyIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CopyIcon.displayName = 'CopyIcon';

export { CopyIcon };

const DownloadIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10L12 15L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

DownloadIcon.displayName = 'DownloadIcon';
export { DownloadIcon };

const EditIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EditIcon.displayName = 'EditIcon';
export { EditIcon };

const EyeIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EyeIcon.displayName = 'EyeIcon';

const EyeOffIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M9.88 9.88C9.58525 10.1546 9.34884 10.4859 9.18487 10.8538C9.02091 11.2218 8.93274 11.6191 8.92563 12.0219C8.91852 12.4247 8.99262 12.8248 9.14351 13.1984C9.29439 13.5719 9.51897 13.9113 9.80384 14.1962C10.0887 14.481 10.4281 14.7056 10.8016 14.8565C11.1752 15.0074 11.5753 15.0815 11.9781 15.0744C12.3809 15.0673 12.7782 14.9791 13.1461 14.8151C13.5141 14.6512 13.8453 14.4147 14.12 14.12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.73 5.08C11.1513 5.02751 11.5754 5.00079 12 5C19 5 22 12 22 12C21.5529 12.9571 20.9922 13.8569 20.33 14.68"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.61 6.61C4.62125 7.96462 3.02987 9.82526 2 12C2 12 5 19 12 19C13.9159 19.0051 15.7908 18.4451 17.39 17.39"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 2L22 22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EyeOffIcon.displayName = 'EyeOffIcon';
export { EyeIcon, EyeOffIcon };

const FavouriteIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M20.42 4.58C19.9183 4.07658 19.3222 3.67714 18.6658 3.40459C18.0094 3.13204 17.3057 2.99174 16.595 2.99174C15.8843 2.99174 15.1806 3.13204 14.5242 3.40459C13.8678 3.67714 13.2717 4.07658 12.77 4.58L12 5.36L11.23 4.58C10.7283 4.07658 10.1322 3.67714 9.47582 3.40459C8.81944 3.13204 8.11571 2.99174 7.40499 2.99174C6.69428 2.99174 5.99055 3.13204 5.33417 3.40459C4.67779 3.67714 4.08167 4.07658 3.57999 4.58C1.45999 6.7 1.32999 10.28 3.99999 13L12 21L20 13C22.67 10.28 22.54 6.7 20.42 4.58Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

FavouriteIcon.displayName = 'FavouriteIcon';
export { FavouriteIcon };

const GlobeIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12H22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

GlobeIcon.displayName = 'GlobeIcon';
export { GlobeIcon };

const GripVerticalIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4C14.4477 4 14 4.44772 14 5C14 5.55228 14.4477 6 15 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 20C15.5523 20 16 19.5523 16 19C16 18.4477 15.5523 18 15 18C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

GripVerticalIcon.displayName = 'GripVerticalIcon';
export { GripVerticalIcon };

const HelpCircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91894 12.4272 7.03872C13.1255 7.15849 13.7588 7.52153 14.2151 8.06353C14.6713 8.60554 14.9211 9.29153 14.92 10C14.92 12 11.92 13 11.92 13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

HelpCircleIcon.displayName = 'HelpCircleIcon';
export { HelpCircleIcon };

const InfoIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

InfoIcon.displayName = 'InfoIcon';
export { InfoIcon };

const LinkIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6898C16.4231 14.4392 17.0331 14.0471 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33397 21.9434 7.02299C21.932 5.71201 21.4061 4.45794 20.4791 3.5309C19.5521 2.60386 18.298 2.07802 16.987 2.06663C15.676 2.05523 14.413 2.55921 13.47 3.47L11.75 5.18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3935 9.60707C11.7643 9.26331 11.0685 9.05889 10.3534 9.00768C9.63821 8.95646 8.92041 9.05964 8.24866 9.31023C7.5769 9.56082 6.96689 9.95294 6.46 10.46L3.46 13.46C2.54921 14.403 2.04524 15.666 2.05663 16.977C2.06802 18.288 2.59387 19.5421 3.52091 20.4691C4.44795 21.3961 5.70201 21.922 7.013 21.9334C8.32398 21.9448 9.58699 21.4408 10.53 20.53L12.24 18.82"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LinkIcon.displayName = 'LinkIcon';

const ExternalLinkIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 3H21V9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 14L21 3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ExternalLinkIcon.displayName = 'ExternalLinkIcon';
export { ExternalLinkIcon, LinkIcon };

const LoaderIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21 12C20.9999 13.9006 20.3981 15.7524 19.2809 17.2899C18.1637 18.8275 16.5885 19.9719 14.7809 20.5592C12.9733 21.1464 11.0262 21.1464 9.21864 20.559C7.41109 19.9716 5.83588 18.8271 4.71876 17.2895C3.60165 15.7519 2.99999 13.9001 3 11.9995C3.00001 10.0989 3.60171 8.24711 4.71884 6.7095C5.83598 5.17189 7.4112 4.02741 9.21877 3.44008C11.0263 2.85274 12.9734 2.85272 14.781 3.44"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LoaderIcon.displayName = 'LoaderIcon';
export { LoaderIcon };

const LockIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LockIcon.displayName = 'LockIcon';
export { LockIcon };

const MailIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MailIcon.displayName = 'MailIcon';
export { MailIcon };

const MenuIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M4 12H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 6H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 18H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MenuIcon.displayName = 'MenuIcon';
export { MenuIcon };

const MessageCircleIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7117 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.60557 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MessageCircleIcon.displayName = 'MessageCircleIcon';

export { MessageCircleIcon };

const MoonIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 3C10.8134 4.19491 10.1488 5.81141 10.1518 7.49539C10.1547 9.17936 10.825 10.7935 12.0157 11.9843C13.2065 13.175 14.8206 13.8453 16.5046 13.8482C18.1886 13.8512 19.8051 13.1866 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17294 13.7558C2.82567 12.01 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3V3Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MoonIcon.displayName = 'MoonIcon';
export { MoonIcon };

const PaperclipIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1141 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 2.00515 15.1615 2.00421C16.2239 2.00328 17.2431 2.42441 17.995 3.17497C18.7469 3.92554 19.1698 4.94404 19.1708 6.00644C19.1717 7.06883 18.7506 8.08808 18 8.83997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4642 6.20472 14.9553 6.58 14.58L15.07 6.09997"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PaperclipIcon.displayName = 'PaperclipIcon';
export { PaperclipIcon };


const PlayIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 8L16 12L10 16V8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PlayIcon.displayName = 'PlayIcon';
export { PlayIcon };

const RemoveIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

RemoveIcon.displayName = 'RemoveIcon';
export { RemoveIcon };

const RepeatIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M17 2L21 6L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11V10C3 8.93913 3.42143 7.92172 4.17157 7.17157C4.92172 6.42143 5.93913 6 7 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 22L3 18L7 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13V14C21 15.0609 20.5786 16.0783 19.8284 16.8284C19.0783 17.5786 18.0609 18 17 18H3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

RepeatIcon.displayName = 'RepeatIcon';

const Repeat1Icon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M17 2L21 6L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11V10C3 8.93913 3.42143 7.92172 4.17157 7.17157C4.92172 6.42143 5.93913 6 7 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 22L3 18L7 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13V14C21 15.0609 20.5786 16.0783 19.8284 16.8284C19.0783 17.5786 18.0609 18 17 18H3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 10H12V14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

Repeat1Icon.displayName = 'Repeat1Icon';
export { Repeat1Icon, RepeatIcon };



const SettingsIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04596 6.33554 7.70108 6.42795 7.35 6.42795C6.99893 6.42795 6.65404 6.33554 6.35 6.16L6.2 6.08C5.74107 5.81526 5.19584 5.74344 4.684 5.88031C4.17217 6.01717 3.73555 6.35154 3.47 6.81L3.25 7.19C2.98526 7.64893 2.91345 8.19416 3.05031 8.706C3.18717 9.21783 3.52154 9.65445 3.98 9.92L4.13 10.02C4.43228 10.1945 4.68362 10.4451 4.85905 10.7468C5.03448 11.0486 5.1279 11.391 5.13 11.74V12.25C5.1314 12.6024 5.03965 12.949 4.86405 13.2545C4.68844 13.5601 4.43521 13.8138 4.13 13.99L3.98 14.08C3.52154 14.3456 3.18717 14.7822 3.05031 15.294C2.91345 15.8058 2.98526 16.3511 3.25 16.81L3.47 17.19C3.73555 17.6485 4.17217 17.9828 4.684 18.1197C5.19584 18.2566 5.74107 18.1847 6.2 17.92L6.35 17.84C6.65404 17.6645 6.99893 17.5721 7.35 17.5721C7.70108 17.5721 8.04596 17.6645 8.35 17.84L8.78 18.09C9.08374 18.2654 9.33602 18.5175 9.51154 18.8212C9.68706 19.1248 9.77964 19.4693 9.78 19.82V20C9.78 20.5304 9.99072 21.0391 10.3658 21.4142C10.7409 21.7893 11.2496 22 11.78 22H12.22C12.7504 22 13.2591 21.7893 13.6342 21.4142C14.0093 21.0391 14.22 20.5304 14.22 20V19.82C14.2204 19.4693 14.3129 19.1248 14.4885 18.8212C14.664 18.5175 14.9163 18.2654 15.22 18.09L15.65 17.84C15.954 17.6645 16.2989 17.5721 16.65 17.5721C17.0011 17.5721 17.346 17.6645 17.65 17.84L17.8 17.92C18.2589 18.1847 18.8042 18.2566 19.316 18.1197C19.8278 17.9828 20.2645 17.6485 20.53 17.19L20.75 16.8C21.0147 16.3411 21.0866 15.7958 20.9497 15.284C20.8128 14.7722 20.4785 14.3356 20.02 14.07L19.87 13.99C19.5648 13.8138 19.3116 13.5601 19.136 13.2545C18.9604 12.949 18.8686 12.6024 18.87 12.25V11.75C18.8686 11.3976 18.9604 11.051 19.136 10.7455C19.3116 10.4399 19.5648 10.1862 19.87 10.01L20.02 9.92C20.4785 9.65445 20.8128 9.21783 20.9497 8.706C21.0866 8.19416 21.0147 7.64893 20.75 7.19L20.53 6.81C20.2645 6.35154 19.8278 6.01717 19.316 5.88031C18.8042 5.74344 18.2589 5.81526 17.8 6.08L17.65 6.16C17.346 6.33554 17.0011 6.42795 16.65 6.42795C16.2989 6.42795 15.954 6.33554 15.65 6.16L15.22 5.91C14.9163 5.73464 14.664 5.48248 14.4885 5.17884C14.3129 4.87519 14.2204 4.53073 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2V2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SettingsIcon.displayName = 'SettingsIcon';
export { SettingsIcon };

const ShareIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.59 13.51L15.42 17.49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.41 6.51L8.59 10.49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ShareIcon.displayName = 'ShareIcon';
export { ShareIcon };

const SlashIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.92999 4.92999L19.07 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SlashIcon.displayName = 'SlashIcon';
export { SlashIcon };

const SunIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2V4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 20V22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.92999 4.93L6.33999 6.34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.66 17.66L19.07 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12H4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 12H22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.33999 17.66L4.92999 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.07 4.93L17.66 6.34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SunIcon.displayName = 'SunIcon';
export { SunIcon };

const ThreeDotsIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44771 11 4 11.4477 4 12C4 12.5523 4.44771 13 5 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ThreeDotsIcon.displayName = 'ThreeDotsIcon';
export { ThreeDotsIcon };

const TrashIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M3 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

TrashIcon.displayName = 'TrashIcon';
export { TrashIcon };

const UnlockIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C6.99876 5.76005 7.45828 4.56387 8.28938 3.64367C9.12047 2.72347 10.2638 2.1449 11.4975 2.02029C12.7312 1.89568 13.9671 2.2339 14.9655 2.96931C15.9638 3.70472 16.6533 4.78485 16.9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

UnlockIcon.displayName = 'UnlockIcon';
export { UnlockIcon };

const HomeAlt = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M10 18V15C10 13.8954 10.8954 13 12 13V13C13.1046 13 14 13.8954 14 15V18" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </>
  ),
});

HomeAlt.displayName = 'HomeAlt';

export { HomeAlt };


const Refresh = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </>
  ),
});

Refresh.displayName = 'Refresh';
export { Refresh };


const MailIn = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </>
  ),
});

MailIn.displayName = 'MailIn';

export { MailIn };

const Wallet = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V18C21 19.1046 20.1046 20 19 20Z" stroke="#131927" stroke-width="1.5" />
      <Path d="M16.5 14C16.2239 14 16 13.7761 16 13.5C16 13.2239 16.2239 13 16.5 13C16.7761 13 17 13.2239 17 13.5C17 13.7761 16.7761 14 16.5 14Z" fill="#131927" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M18 7V5.60322C18 4.28916 16.7544 3.33217 15.4847 3.67075L4.48467 6.60409C3.60917 6.83756 3 7.63046 3 8.53656V9" stroke="#131927" stroke-width="1.5" />
    </>
  ),
});

Wallet.displayName = 'Wallet';
export { Wallet };


const ChatBubble = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M17 12.5C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5C16.7239 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.7239 12.5 17 12.5Z" fill="#131927" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="#131927" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M7 12.5C7.27614 12.5 7.5 12.2761 7.5 12C7.5 11.7239 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5Z" fill="#131927" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </>
  ),
});

ChatBubble.displayName = 'ChatBubble';
export { ChatBubble };

const BellNotification = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>

      <Path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />


    </>
  ),
});

BellNotification.displayName = 'BellNotification';
export { BellNotification };


const Notes = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M8 14L16 14" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M8 10L10 10" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M8 18L12 18" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M10 3H6C4.89543 3 4 3.89543 4 5V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V5C20 3.89543 19.1046 3 18 3H14.5M10 3V1M10 3V5" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />


    </>
  ),
});

Notes.displayName = 'Notes';
export { Notes };



const PrivacyPolicy = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H13" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M8 10H16M8 6H12M8 14H11" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M19.9923 15.125L22.5477 15.774C22.8137 15.8416 23.0013 16.0833 22.9931 16.3576C22.8214 22.1159 19.5 23 19.5 23C19.5 23 16.1786 22.1159 16.0069 16.3576C15.9987 16.0833 16.1863 15.8416 16.4523 15.774L19.0077 15.125C19.3308 15.043 19.6692 15.043 19.9923 15.125Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </>
  ),
});

PrivacyPolicy.displayName = 'PrivacyPolicy';
export { PrivacyPolicy };

const Settings = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

    </>
  ),
});

Settings.displayName = 'Settings';
export { Settings };

const Logout = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#FE0F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M16 17L21 12L16 7" stroke="#FE0F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M21 12H9" stroke="#FE0F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M41.4091 17V5.36364H42.8182V15.75H48.2273V17H41.4091ZM53.5327 17.1818C52.7448 17.1818 52.0536 16.9943 51.4589 16.6193C50.868 16.2443 50.4058 15.7197 50.0725 15.0455C49.743 14.3712 49.5782 13.5833 49.5782 12.6818C49.5782 11.7727 49.743 10.9792 50.0725 10.3011C50.4058 9.62311 50.868 9.09659 51.4589 8.72159C52.0536 8.34659 52.7448 8.15909 53.5327 8.15909C54.3206 8.15909 55.01 8.34659 55.6009 8.72159C56.1956 9.09659 56.6577 9.62311 56.9873 10.3011C57.3206 10.9792 57.4873 11.7727 57.4873 12.6818C57.4873 13.5833 57.3206 14.3712 56.9873 15.0455C56.6577 15.7197 56.1956 16.2443 55.6009 16.6193C55.01 16.9943 54.3206 17.1818 53.5327 17.1818ZM53.5327 15.9773C54.1312 15.9773 54.6236 15.8239 55.01 15.517C55.3964 15.2102 55.6823 14.8068 55.868 14.3068C56.0536 13.8068 56.1464 13.2652 56.1464 12.6818C56.1464 12.0985 56.0536 11.5549 55.868 11.0511C55.6823 10.5473 55.3964 10.1402 55.01 9.82955C54.6236 9.51894 54.1312 9.36364 53.5327 9.36364C52.9342 9.36364 52.4418 9.51894 52.0555 9.82955C51.6691 10.1402 51.3831 10.5473 51.1975 11.0511C51.0119 11.5549 50.9191 12.0985 50.9191 12.6818C50.9191 13.2652 51.0119 13.8068 51.1975 14.3068C51.3831 14.8068 51.6691 15.2102 52.0555 15.517C52.4418 15.8239 52.9342 15.9773 53.5327 15.9773ZM62.8169 20.4545C62.1691 20.4545 61.6123 20.3712 61.1464 20.2045C60.6805 20.0417 60.2923 19.8258 59.9816 19.5568C59.6748 19.2917 59.4305 19.0076 59.2487 18.7045L60.3169 17.9545C60.4381 18.1136 60.5915 18.2955 60.7771 18.5C60.9627 18.7083 61.2165 18.8883 61.5385 19.0398C61.8642 19.1951 62.2904 19.2727 62.8169 19.2727C63.5214 19.2727 64.1029 19.1023 64.5612 18.7614C65.0195 18.4205 65.2487 17.8864 65.2487 17.1591V15.3864H65.1351C65.0366 15.5455 64.8964 15.7424 64.7146 15.9773C64.5366 16.2083 64.279 16.4148 63.9419 16.5966C63.6085 16.7746 63.1578 16.8636 62.5896 16.8636C61.8851 16.8636 61.2525 16.697 60.6919 16.3636C60.1351 16.0303 59.6938 15.5455 59.368 14.9091C59.046 14.2727 58.8851 13.5 58.8851 12.5909C58.8851 11.697 59.0423 10.9186 59.3566 10.2557C59.671 9.58901 60.1085 9.07386 60.6691 8.71023C61.2298 8.3428 61.8775 8.15909 62.6123 8.15909C63.1805 8.15909 63.6313 8.25379 63.9646 8.44318C64.3017 8.62879 64.5593 8.84091 64.7373 9.07955C64.9191 9.31439 65.0593 9.50758 65.1578 9.65909H65.2941V8.27273H66.5896V17.25C66.5896 18 66.4191 18.6098 66.0782 19.0795C65.7411 19.553 65.2866 19.8996 64.7146 20.1193C64.1464 20.3428 63.5138 20.4545 62.8169 20.4545ZM62.7714 15.6591C63.3093 15.6591 63.7638 15.536 64.1351 15.2898C64.5063 15.0436 64.7885 14.6894 64.9816 14.2273C65.1748 13.7652 65.2714 13.2121 65.2714 12.5682C65.2714 11.9394 65.1767 11.3845 64.9873 10.9034C64.7979 10.4223 64.5176 10.0455 64.1464 9.77273C63.7752 9.5 63.3169 9.36364 62.7714 9.36364C62.2032 9.36364 61.7298 9.50758 61.351 9.79545C60.976 10.0833 60.6938 10.4697 60.5044 10.9545C60.3188 11.4394 60.226 11.9773 60.226 12.5682C60.226 13.1742 60.3207 13.7102 60.5101 14.1761C60.7032 14.6383 60.9873 15.0019 61.3623 15.267C61.7411 15.5284 62.2108 15.6591 62.7714 15.6591ZM76.6096 17.1818C75.8217 17.1818 75.1304 16.9943 74.5357 16.6193C73.9448 16.2443 73.4827 15.7197 73.1494 15.0455C72.8198 14.3712 72.6551 13.5833 72.6551 12.6818C72.6551 11.7727 72.8198 10.9792 73.1494 10.3011C73.4827 9.62311 73.9448 9.09659 74.5357 8.72159C75.1304 8.34659 75.8217 8.15909 76.6096 8.15909C77.3975 8.15909 78.0869 8.34659 78.6778 8.72159C79.2725 9.09659 79.7346 9.62311 80.0641 10.3011C80.3975 10.9792 80.5641 11.7727 80.5641 12.6818C80.5641 13.5833 80.3975 14.3712 80.0641 15.0455C79.7346 15.7197 79.2725 16.2443 78.6778 16.6193C78.0869 16.9943 77.3975 17.1818 76.6096 17.1818ZM76.6096 15.9773C77.2081 15.9773 77.7005 15.8239 78.0869 15.517C78.4732 15.2102 78.7592 14.8068 78.9448 14.3068C79.1304 13.8068 79.2232 13.2652 79.2232 12.6818C79.2232 12.0985 79.1304 11.5549 78.9448 11.0511C78.7592 10.5473 78.4732 10.1402 78.0869 9.82955C77.7005 9.51894 77.2081 9.36364 76.6096 9.36364C76.0111 9.36364 75.5187 9.51894 75.1323 9.82955C74.746 10.1402 74.46 10.5473 74.2744 11.0511C74.0888 11.5549 73.996 12.0985 73.996 12.6818C73.996 13.2652 74.0888 13.8068 74.2744 14.3068C74.46 14.8068 74.746 15.2102 75.1323 15.517C75.5187 15.8239 76.0111 15.9773 76.6096 15.9773ZM87.871 13.4318V8.27273H89.2119V17H87.871V15.5227H87.7801C87.5756 15.9659 87.2574 16.3428 86.8256 16.6534C86.3937 16.9602 85.8483 17.1136 85.1892 17.1136C84.6437 17.1136 84.1589 16.9943 83.7347 16.7557C83.3104 16.5133 82.9771 16.1496 82.7347 15.6648C82.4922 15.1761 82.371 14.5606 82.371 13.8182V8.27273H83.7119V13.7273C83.7119 14.3636 83.89 14.8712 84.246 15.25C84.6059 15.6288 85.0642 15.8182 85.621 15.8182C85.9544 15.8182 86.2934 15.733 86.6381 15.5625C86.9866 15.392 87.2782 15.1307 87.5131 14.7784C87.7517 14.4261 87.871 13.9773 87.871 13.4318ZM95.2234 8.27273V9.40909H90.7006V8.27273H95.2234ZM92.0188 6.18182H93.3597V14.5C93.3597 14.8788 93.4146 15.1629 93.5245 15.3523C93.6381 15.5379 93.7821 15.6629 93.9563 15.7273C94.1343 15.7879 94.3218 15.8182 94.5188 15.8182C94.6665 15.8182 94.7877 15.8106 94.8824 15.7955C94.9771 15.7765 95.0529 15.7614 95.1097 15.75L95.3824 16.9545C95.2915 16.9886 95.1646 17.0227 95.0018 17.0568C94.8389 17.0947 94.6324 17.1136 94.3824 17.1136C94.0037 17.1136 93.6324 17.0322 93.2688 16.8693C92.909 16.7064 92.6097 16.4583 92.3711 16.125C92.1362 15.7917 92.0188 15.3712 92.0188 14.8636V6.18182Z" fill="#FE0F00" />


    </>
  ),
});

Logout.displayName = 'Logout';
export { Logout };

// Chat specific icons
const SendIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M22 2L11 13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SendIcon.displayName = 'SendIcon';
export { SendIcon };

const MicIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10V12C19 16.4183 15.4183 20 11 20H13C17.4183 20 21 16.4183 21 12V10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 20V23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 23H16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MicIcon.displayName = 'MicIcon';
export { MicIcon };

const PhoneIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PhoneIcon.displayName = 'PhoneIcon';
export { PhoneIcon };

const PhoneOffIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M10.68 13.31C10.4094 12.9562 10.1925 12.5669 10.0368 12.1535C9.88108 11.7402 9.78896 11.3096 9.76348 10.8736C9.73799 10.4376 9.77951 10.0031 9.88608 9.58168C9.99266 9.16024 10.1621 8.75832 10.39 8.39L9.39 7.39C8.74 8.21 8.31 9.2 8.14 10.25C7.97 11.3 8.06 12.38 8.39 13.39L10.68 13.31Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 9.4C16.8 8.8 17 8.1 17 7.4C17 5.6 15.4 4 13.6 4C12.9 4 12.2 4.2 11.6 4.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 16.92V19.92C22 20.49 21.77 21.02 21.37 21.42C20.97 21.82 20.44 22.05 19.87 22.05C16.94 21.73 14.12 20.73 11.69 19.13L22 8.82V16.92Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.27 1.27L22.73 22.73"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PhoneOffIcon.displayName = 'PhoneOffIcon';
export { PhoneOffIcon };

const SpeakerIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M11 5L6 9H2V15H6L11 19V5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SpeakerIcon.displayName = 'SpeakerIcon';
export { SpeakerIcon };

const SearchIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SearchIcon.displayName = 'SearchIcon';
export { SearchIcon };


const VechileCar = createIcon({
  Root: Svg,
  viewBox: '0 0 53 53',
  path: (
    <>
      <Path d="M8.28125 25.9479C8.28125 24.7765 8.74658 23.6531 9.57486 22.8249C10.4031 21.9966 11.5265 21.5312 12.6979 21.5312H40.3021C41.4735 21.5312 42.5969 21.9966 43.4251 22.8249C44.2534 23.6531 44.7187 24.7765 44.7187 25.9479V39.1979H8.28125V25.9479Z" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M15.4583 30.9167C16.678 30.9167 17.6667 29.928 17.6667 28.7083C17.6667 27.4887 16.678 26.5 15.4583 26.5C14.2387 26.5 13.25 27.4887 13.25 28.7083C13.25 29.928 14.2387 30.9167 15.4583 30.9167Z" fill="#131927" />
      <Path d="M37.5417 30.9167C38.7613 30.9167 39.75 29.928 39.75 28.7083C39.75 27.4887 38.7613 26.5 37.5417 26.5C36.3221 26.5 35.3334 27.4887 35.3334 28.7083C35.3334 29.928 36.3221 30.9167 37.5417 30.9167Z" fill="#131927" />
      <Path d="M22.0833 32.5723H30.9167M13.8485 12.2931C14.1582 11.4408 14.7227 10.7044 15.4655 10.1841C16.2083 9.66373 17.0932 9.38466 18.0001 9.38477H34.9999C35.9068 9.38466 36.7917 9.66373 37.5345 10.1841C38.2772 10.7044 38.8418 11.4408 39.1515 12.2931L42.5104 21.5306H10.4896L13.8485 12.2931ZM8.28125 39.1973H15.8735V42.9514C15.8735 43.7128 15.571 44.443 15.0327 44.9814C14.4943 45.5198 13.7641 45.8223 13.0027 45.8223H11.1521C10.3907 45.8223 9.66048 45.5198 9.1221 44.9814C8.58371 44.443 8.28125 43.7128 8.28125 42.9514V39.1973ZM37.1287 39.1973H44.7187V42.9514C44.7187 43.7128 44.4163 44.443 43.8779 44.9814C43.3395 45.5198 42.6093 45.8223 41.8479 45.8223H39.9995C39.2382 45.8223 38.5079 45.5198 37.9696 44.9814C37.4312 44.443 37.1287 43.7128 37.1287 42.9514V39.1973Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

    </>
  ),
});

VechileCar.displayName = 'VechileCar';
export { VechileCar };


const Sharpship = createIcon({
  Root: Svg,
  viewBox: '0 0 53 53',
  path: (
    <>
      <Path d="M7.72914 38.6452L4.41443 35.3327V26.4994H48.5877V35.3327L45.2708 38.6452M4.41664 43.0619C4.41664 44.5261 4.99829 45.9303 6.03365 46.9657C7.06901 48.001 8.47325 48.5827 9.93747 48.5827C11.4017 48.5827 12.8059 48.001 13.8413 46.9657C14.8766 45.9303 15.4583 44.5261 15.4583 43.0619C15.4583 44.5261 16.04 45.9303 17.0753 46.9657C18.1107 48.001 19.5149 48.5827 20.9791 48.5827C22.4434 48.5827 23.8476 48.001 24.883 46.9657C25.9183 45.9303 26.5 44.5261 26.5 43.0619C26.5 44.5261 27.0816 45.9303 28.117 46.9657C29.1523 48.001 30.5566 48.5827 32.0208 48.5827C33.485 48.5827 34.8893 48.001 35.9246 46.9657C36.96 45.9303 37.5416 44.5261 37.5416 43.0619C37.5416 44.5261 38.1233 45.9303 39.1587 46.9657C40.194 48.001 41.5983 48.5827 43.0625 48.5827C44.5267 48.5827 45.9309 48.001 46.9663 46.9657C48.0016 45.9303 48.5833 44.5261 48.5833 43.0619M41.9583 26.4994H11.0416L13.25 13.2493H39.75L41.9583 26.4994ZM30.9166 4.41602H22.0833V13.2493H30.9166V4.41602Z" stroke-width="1.5" />

    </>
  ),
});

Sharpship.displayName = 'Sharpship';
export { Sharpship };


const Aeroplane = createIcon({
  Root: Svg,
  viewBox: '0 0 53 53',
  path: (
    <>
      <Path d="M31.2126 15.4412L38.7121 7.93949C39.5564 7.10891 40.6946 6.64558 41.879 6.65043C43.0633 6.65527 44.1977 7.12789 45.0352 7.96535C45.8726 8.8028 46.3453 9.93724 46.3501 11.1216C46.3549 12.3059 45.8916 13.4442 45.061 14.2884L37.5593 21.7879L41.6183 41.9832C42.1372 44.5669 37.1265 48.1665 35.7927 44.7436L29.8522 29.4972L22.1385 37.2109C22.514 41.7182 22.5957 43.2176 19.4355 46.3755L14.6324 38.3681L6.625 33.565C9.78292 30.4049 11.2824 30.4844 15.7896 30.862L23.5033 23.1505L8.25696 17.2079C4.83404 15.874 8.43362 10.8611 11.0174 11.3823L31.2126 15.4412Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

    </>
  ),
});

Aeroplane.displayName = 'Aeroplane';
export { Aeroplane };




const MenuScale = createIcon({
  Root: Svg,
  viewBox: '0 0 24 38',
  path: (
    <>
      <Path d="M3 7.84924H11" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M3 18.7286H16" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M3 29.6079H21" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

    </>
  ),
});

MenuScale.displayName = 'MenuScale';
export { MenuScale };

const Location = createIcon({
  Root: Svg,
  viewBox: '0 0 16 16',
  path: (
    <>
      <Path d="M8 1C5.23969 1 3 3.01594 3 5.5C3 9.5 8 15 8 15C8 15 13 9.5 13 5.5C13 3.01594 10.7603 1 8 1ZM8 8C7.60444 8 7.21776 7.8827 6.88886 7.66294C6.55996 7.44318 6.30362 7.13082 6.15224 6.76537C6.00087 6.39991 5.96126 5.99778 6.03843 5.60982C6.1156 5.22186 6.30608 4.86549 6.58579 4.58579C6.86549 4.30608 7.22186 4.1156 7.60982 4.03843C7.99778 3.96126 8.39991 4.00087 8.76537 4.15224C9.13082 4.30362 9.44318 4.55996 9.66294 4.88886C9.8827 5.21776 10 5.60444 10 6C9.99942 6.53026 9.78852 7.03863 9.41357 7.41357C9.03863 7.78852 8.53026 7.99942 8 8Z" />

    </>
  ),
});

Location.displayName = 'Location';
export { Location };


const WarningCircle = createIcon({
  Root: Svg,
  viewBox: '0 0 25 24',
  path: (
    <>
      <Path d="M12.5 7L12.5 13" stroke="#FF0004" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12.5 17.01L12.51 16.9989" stroke="#FF0004" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="#FF0004" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />


    </>
  ),
});

WarningCircle.displayName = 'WarningCircle';
export { WarningCircle };


const StarIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 20 18',
  path: (
    <>

      <Path d="M9.91417 13.7739L15.9454 18L13.6369 11.1757L19.6682 7.04348H12.2714L9.91417 0L7.55695 7.04348H0.160156L6.19139 11.1757L3.88294 18L9.91417 13.7739Z" />


    </>
  )
})

StarIcon.displayName = 'StarIcon';
export { StarIcon };

const UploadIcon = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10L12 5L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 5V15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

UploadIcon.displayName = 'UploadIcon';
export { UploadIcon };


const Facebook = createIcon({
  Root: Svg,
  viewBox: '0 0 21 20',
  path: (
    <>

      <Path d="M13.8822 3.85413C12.7662 3.85413 12.449 4.34912 12.449 5.44037V7.2415H15.4173L15.1248 10.1592H12.4484V19H8.89625V10.1586H6.5V7.24094H8.89738V5.49044C8.89738 2.54688 10.0775 1 13.3878 1C14.0982 1 14.9482 1.05625 15.4556 1.12712V3.8665" fill="#3C5A99" />


    </>
  ),
});

Facebook.displayName = 'Google';
export { Facebook };

const Google = createIcon({
  Root: Svg,
  viewBox: '0 0 19 19',
  path: (
    <>
      <G clipPath="url(#clip0)">
        <Path d="M18.6749 9.71009C18.6749 8.93122 18.6131 8.36285 18.4792 7.77344H9.77344V11.2889H14.8835C14.7805 12.1625 14.2242 13.4782 12.9878 14.3623L12.9705 14.48L15.7231 16.6585L15.9138 16.6779C17.6652 15.0254 18.6749 12.594 18.6749 9.71009Z" fill="#4285F4" />
        <Path d="M9.77165 18.9724C12.2752 18.9724 14.3769 18.1303 15.912 16.6778L12.9861 14.3622C12.2031 14.9201 11.1522 15.3095 9.77165 15.3095C7.31963 15.3095 5.23851 13.6571 4.49664 11.373L4.3879 11.3825L1.52571 13.6454L1.48828 13.7517C3.01306 16.8462 6.14508 18.9724 9.77165 18.9724Z" fill="#34A853" />
        <Path d="M4.4974 11.3731C4.30165 10.7837 4.18836 10.1521 4.18836 9.49955C4.18836 8.84693 4.30165 8.21543 4.4871 7.62602L4.48191 7.50049L1.58385 5.20117L1.48903 5.24725C0.860597 6.53136 0.5 7.97337 0.5 9.49955C0.5 11.0257 0.860597 12.4677 1.48903 13.7518L4.4974 11.3731Z" fill="#FBBC05" />
        <Path d="M9.77165 3.69016C11.5128 3.69016 12.6873 4.45851 13.357 5.1006L15.9738 2.49029C14.3667 0.964108 12.2752 0.0273438 9.77165 0.0273438C6.14508 0.0273438 3.01306 2.15346 1.48828 5.2479L4.48635 7.62667C5.23851 5.34267 7.31963 3.69016 9.77165 3.69016Z" fill="#EB4335" />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect x="0.5" width="18.1739" height="19" rx="9.08696" fill="white" />
        </ClipPath>
      </Defs>
    </>
  ),
});

Google.displayName = 'Google';
export { Google };

const Apple = createIcon({
  Root: Svg,
  viewBox: '0 0 21 20',
  path: (
    <>
      <Path d="M16.3169 10.534C16.3081 8.90076 17.037 7.668 18.5122 6.76012C17.6868 5.56297 16.4399 4.90432 14.7934 4.77526C13.2348 4.65065 11.5313 5.69648 10.9078 5.69648C10.2492 5.69648 8.73891 4.81976 7.55347 4.81976C5.10357 4.85981 2.5 6.80018 2.5 10.7477C2.5 11.9137 2.71074 13.1182 3.13223 14.3614C3.69422 15.9947 5.72263 20 7.83886 19.9332C8.94527 19.9065 9.72678 19.1366 11.1669 19.1366C12.563 19.1366 13.2875 19.9332 14.5212 19.9332C16.655 19.9021 18.4902 16.2617 19.0259 14.6239C16.1633 13.2577 16.3169 10.6186 16.3169 10.534ZM13.8319 3.22652C15.0305 1.7846 14.9207 0.47174 14.8856 0C13.8275 0.0623053 12.6026 0.729862 11.9045 1.55318C11.1361 2.43436 10.6839 3.5247 10.7805 4.753C11.9264 4.84201 12.9714 4.24566 13.8319 3.22652Z" fill="black" />

    </>
  ),
});

Apple.displayName = 'Apple';
export { Apple };


const Inbox = createIcon({
  Root: Svg,
  viewBox: '0 0 24 24',
  path: (
    <>

      <Path d="M5 9L9.5 12L14 9" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M17 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H16C17.1046 5 18 5.89543 18 7V9" stroke="#131927" stroke-width="1.5" stroke-linecap="round" />
      <Path d="M23 14H17M17 14L20 11M17 14L20 17" stroke="#131927" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />

    </>
  ),
});

Inbox.displayName = 'InboxIcon';
export { Inbox };



