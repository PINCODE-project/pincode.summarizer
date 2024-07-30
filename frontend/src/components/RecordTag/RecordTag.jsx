import {Badge} from '@mantine/core';
import {useNavigate} from "react-router-dom";

export function RecordTag({tag}) {
    const navigate = useNavigate();

    const tagName = {
        "Recorded": "Записано",
        "Transcribing": "Транскрибируется",
        "Transcribed": "Транскрибировано",
        "Summarizing": "Суммаризируется",
        "Summarized": "Суммаризировано"
    }

    const tagColor = {
        "Recorded": "red",
        "Transcribing": "yellow",
        "Transcribed": "blue",
        "Summarizing": "yellow",
        "Summarized": "green"
    }

    return (
        <Badge variant="light" color={tagColor[tag]} size="lg">
            {tagName[tag]}
        </Badge>
    );
}
