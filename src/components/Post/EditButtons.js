import { getBtnContainerStyle } from "./Post";
import ReviseButtons from "./ReviseButtons";
import FormatButtons from "./FormatButtons";

export default function EditButtons({ contentRef, textInput }) {
    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <ReviseButtons {...{ contentRef, textInput }} />
            <FormatButtons {...{ contentRef }} />
        </div>
    );
}
