import {
    ActionIcon,
    Button,
    Center,
    Group,
    Loader,
    Paper,
    ScrollArea,
    Stack,
    Tabs,
    Text,
    Title,
    TypographyStylesProvider
} from '@mantine/core';
import {useRecord} from "../../hooks/useRecord";
import {useTranscribe} from "../../hooks/useTranscribe";
import {notifications} from "@mantine/notifications";
import {useQueryClient} from "@tanstack/react-query";
import styles from "./RecordPanel.module.css"
import {RecordTag} from "../RecordTag/RecordTag";
import {useCallback, useMemo, useRef} from "react";
import {useWavesurfer} from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import {ConfigService} from "../../services/config.service";
import {IconPlayerPlay, IconPlayerStop, IconRewindBackward10, IconRewindForward10} from "@tabler/icons-react";
import Markdown from "react-markdown";
import {useSummarize} from "../../hooks/useSummarize";

export function RecordPanel(props) {
    // const {user, isLoading: isLoadingUser} = useUser()
    // const {recordId} = useParams()

    const record = useRecord(props.recordId)
    const queryClient = useQueryClient()

    const onSuccessTranscribe = () => {
        notifications.show({
            title: 'Запись успешно транскрибирована!',
            color: 'green'
        })
        queryClient.invalidateQueries({queryKey: ['getRecords']})
        queryClient.invalidateQueries({queryKey: ['getRecord', props.recordId]})
    }

    const onSuccessSummarize = () => {
        notifications.show({
            title: 'Запись успешно суммаризирована!',
            color: 'green'
        })
        queryClient.invalidateQueries({queryKey: ['getRecords']})
        queryClient.invalidateQueries({queryKey: ['getRecord', props.recordId]})
    }

    const transcribe = useTranscribe(onSuccessTranscribe, () => {
    })

    const summarize = useSummarize(onSuccessSummarize, () => {
    })

    const containerRef = useRef(null)

    const {wavesurfer, isPlaying, currentTime} = useWavesurfer({
        container: containerRef,
        height: 50,
        waveColor: '#a4a7e3',
        progressColor: '#e21a1a',
        url: `${ConfigService.STATIC}/uploads/${record.record?.fileName}`,
        plugins: useMemo(() => [Timeline.create()], []),
    })

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
    }, [wavesurfer])

    const onSkip = useCallback(() => {
        wavesurfer && wavesurfer.skip(10)
    }, [wavesurfer])

    const onBack = useCallback(() => {
        wavesurfer && wavesurfer.skip(-10)
    }, [wavesurfer])

    console.log(record)
    if (!props.recordId)
        return (
            <Center h="100%">
                <Text c="dimmed" size="xl">
                    Для начала работы выберите аудиозапись
                </Text>
            </Center>
        )

    if (record.isLoading)
        return (
            <Center h="100%">
                <Loader/>
            </Center>
        )


    return (
        <Stack>
            <Title order={3}>{record.record.name}</Title>
            <Group>
                <Text c="dimmed">Статус: </Text>
                <RecordTag tag={record.record.status}/>
            </Group>
            <Group>
                <Text c="dimmed">Дата добавления: </Text>
                <Text>{record.record.createdAt}</Text>
            </Group>

            <div className={styles.player} ref={containerRef}/>
            <Group justify='center'>
                <ActionIcon onClick={onBack}>
                    <IconRewindBackward10/>
                </ActionIcon>
                <ActionIcon onClick={onPlayPause}>
                    {isPlaying ? <IconPlayerStop/> : <IconPlayerPlay/>}
                </ActionIcon>
                <ActionIcon onClick={onSkip}>
                    <IconRewindForward10/>
                </ActionIcon>
            </Group>

            <Tabs defaultValue="transcribe">
                <Tabs.List>
                    <Tabs.Tab value="transcribe">
                        Транскрибация
                    </Tabs.Tab>
                    <Tabs.Tab value="summarize">
                        Суммаризация
                    </Tabs.Tab>
                    <Tabs.Tab value="dialog">
                        Диалог с AI
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="transcribe">
                    <Stack pt="md">
                        <Paper className={styles.transcribeCard} p="md" radius="lg">
                            <ScrollArea h={250} scrollbarSize={2} scrollHideDelay={500}>
                                <Stack gap={30}>
                                    {record.record.transcription ? record.record.transcription.map(tr => {
                                        return (
                                            <Stack gap={5}>
                                                <Title order={4}>{tr.speaker}</Title>
                                                <Text>{tr.message}</Text>
                                            </Stack>
                                        )
                                    }) : <>Не транскрибировано</>}
                                </Stack>
                            </ScrollArea>
                        </Paper>
                        <Button
                            disabled={record.record.transcription}
                            onClick={() => {
                                transcribe.mutate(props.recordId)
                                setTimeout(() => {
                                    queryClient.invalidateQueries({ queryKey: ['getRecords'] })
                                    queryClient.invalidateQueries({ queryKey: ['getRecord', props.recordId] })
                                }, 1000)
                            }}>Транскрибировать</Button>
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="summarize">
                    <Stack pt="md">
                        <Paper className={styles.transcribeCard} p="md" radius="lg">
                            <ScrollArea h={250} scrollbarSize={2} scrollHideDelay={500}>
                                <Stack gap={30}>
                                    {record.record.summarization ?
                                        <Markdown>{record.record.summarization.summarized_text}</Markdown> :
                                        <>Не суммаризировано</>}
                                </Stack>
                            </ScrollArea>
                        </Paper>
                        <Button
                            disabled={!record.record.transcription || record.record.summarization}
                            onClick={() => {
                                summarize.mutate(props.recordId)
                                setTimeout(() => {
                                    queryClient.invalidateQueries({ queryKey: ['getRecords'] })
                                    queryClient.invalidateQueries({ queryKey: ['getRecord', props.recordId] })
                                }, 1000)
                            }}>Суммаризировать</Button>
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="dialog">
                    Settings tab content
                </Tabs.Panel>
            </Tabs>
        </Stack>

    );
}
