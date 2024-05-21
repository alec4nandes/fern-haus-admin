import { getBtnContainerStyle } from "./Post";
import ReviseButtons from "./ReviseButtons";
import FormatButtons from "./FormatButtons";

export default function EditButtons({ contentRef, reviseInput }) {
    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <ReviseButtons {...{ contentRef, reviseInput }} />
            <FormatButtons {...{ contentRef }} />
        </div>
    );
}
