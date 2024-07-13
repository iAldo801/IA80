/**
 * @author: iAldo801 (https://github.com/ialdo801)
 * @description: This is a utility component that allows you to use Lucide icons in your project, without the need to import each icon individually, and also provides a way to customize the size, and color of the icons.
 * @package: lucide-react (https://lucide.dev/icons/)
 */

import { cva, type VariantProps } from 'class-variance-authority';
import * as Icons from 'lucide-react';
import * as React from 'react';

interface IconProps extends VariantProps<typeof iconVariants> {
    name: IconKey;
    color?: string; // This prop is not used in the Lucide icons library, but it's here for consistency. Also the format of the color prop does not matter, it can be a hex code, rgb, rgba, hsl, hsla, etc.
    size?: IconSize | null | undefined; // Refer to the IconSize type for the available options, and variable sizes for the corresponding values.
}

type IconKey = keyof typeof Icons;
type IconSize = 'default' | 'sm' | 'lg' | 'xl';

const sizes: Record<IconSize, string> = {
    default: '1.25rem',
    sm: '1rem',
    lg: '1.5rem',
    xl: '2rem',
};

const iconVariants = cva(
    '...',
    {
        variants: {
            size: {
                ...sizes,
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

const IconLucide: React.FC<IconProps & React.HTMLAttributes<HTMLElement>> = ({ name, color, size, ...rest }) => {
    const IconComponent = Icons[name as IconKey] as React.ComponentType<{ size?: string; color?: string }>;

    if (!IconComponent) {
        throw new Error(`Icon ${name} does not exist in Lucide icons library.`);
    }

    if (size && !Object.keys(sizes).includes(size)) {
        throw new Error(`Invalid size prop provided to Icon component. Expected one of: ${Object.keys(sizes).join(', ')}.`);
    }

    const sizeValue = sizes[size as IconSize] || sizes.default;

    return <IconComponent size={sizeValue} color={color} {...rest} />;
};

export { IconLucide, iconVariants };

