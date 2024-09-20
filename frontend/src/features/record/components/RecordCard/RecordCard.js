import React from 'react';
import {Paper, Stack, Title, Text, Group, ActionIcon} from '@mantine/core';
import {RecordTag} from "../../../../components/RecordTag/RecordTag";
import {IconDots} from "@tabler/icons-react";
import styles from "./RecordCard.module.css"
import clsx from "clsx";
import {useNavigate} from "react-router-dom";

export function RecordCard(props) {
    const navigate = useNavigate()
    let date = new Date(props.record.updatedAt ?? "2024-07-21 00:00:00");
    let dateArray = date.toDateString().split(" ")
    let timeArray = props.record.updatedAt.split("T")[1].split(".")

    const translateMonth = {
        "Jan": "января",
        "Feb": "февраля",
        "Mar": "марта",
        "Apr": "апреля",
        "May": "мая",
        "Jun": "июня",
        "Jul": "июля",
        "Aug": "августа",
        "Sep": "сентября",
        "Oct": "октября",
        "Nov": "ноября",
        "Dec": "декабря",
    }

    return (
        <Paper
            shadow={props.isSelect && "lg"}
            p="lg"
            radius="md"
            className={clsx(styles.card, props.isSelect && styles.selected)}
            onClick={() => {
                props.setSelectedRecord(props.isSelect ? null : props.record.id)
                navigate(props.isSelect ? "/" : `/${props.record.id}`)
            }}
        >
            <Group justify="space-between">
                <Stack gap="xs">
                    <Title order={4}>{props.record.name}</Title>
                    <Text c="dimmed">{`${dateArray[2]} ${translateMonth[dateArray[1]]}, ${dateArray[3]}, ${timeArray[0]}`}</Text>
                </Stack>
                <Group>
                    <RecordTag tag={props.record.status}/>
                    {/*<Text>{props.record.durationInSeconds/60}:{props.record.durationInSeconds%60}</Text>*/}
                    <ActionIcon variant="subtle" color="gray" aria-label="Settings">
                        <IconDots/>
                    </ActionIcon>
                </Group>

            </Group>
        </Paper>
    )
}
