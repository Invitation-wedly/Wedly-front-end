import { css, cx, type LinariaClassName } from "@linaria/core";
import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType
} from "react";

type ViewProps = {
    as?: ElementType;
    ui?: LinariaClassName | string;
    className?: string;
} & Omit<ComponentPropsWithoutRef<ElementType>, "as" | "className">;

const defaultStyle = css`
    display: flex;
    flex-direction: column;
`;

const View = forwardRef<HTMLElement, ViewProps>(function View(
    {
        as,
        ui,
        className,
        ...props
    }: ViewProps,
    ref
) {
    const Component = (as || "div") as ElementType;
    return (
        <Component
            {...props as Record<string, unknown>}
            ref={ref as never}
            className={cx(defaultStyle, ui, className)}
        />
    );
});

View.displayName = "View";

export default View;
