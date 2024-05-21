import { getBtnContainerStyle } from "./Post";
import ReviseButtons from "./ReviseButtons";
import FormatButtons from "./FormatButtons";

export default function EditButtons({
    contentRef,
    isRevising,
    setIsRevising,
    acceptRejectRef,
}) {
    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <ReviseButtons
                {...{ contentRef, isRevising, setIsRevising, acceptRejectRef }}
            />
            <FormatButtons {...{ contentRef }} />
        </div>
    );
}
