import { getBtnContainerStyle } from "./Post";
import ReviseButtons from "./ReviseButtons";
import FormatButtons from "./FormatButtons";

export default function EditButtons({ contentRef }) {
    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <ReviseButtons {...{ contentRef }} />
            <FormatButtons {...{ contentRef }} />
        </div>
    );
}
