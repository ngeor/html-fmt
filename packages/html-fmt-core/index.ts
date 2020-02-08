import { FormatOptions } from "./src/FormatOptions";
import { Formatter } from "./src/Formatter";

export * from "./src/Formatter";
export * from "./src/FormatOptions";

export function format(data: string, overrideOptions?: Partial<FormatOptions>) {
    const formatter = new Formatter(data, overrideOptions);
    return formatter.format();
}
