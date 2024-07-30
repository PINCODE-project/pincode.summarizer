import {ActionIcon, Button, Container, Group, Loader, Paper, Select, Stack, Tooltip} from '@mantine/core';
import styles from "./RecordsPage.module.css"
import {useRef, useState} from "react";
import {RecordCard} from "../../components/RecordCard/RecordCard";
import {IconFilePlus, IconMicrophone, IconPlayerStop, IconPlus} from "@tabler/icons-react"
import {useUploadRecord} from "../../../../hooks/useUploadRecord";
import {useRecords} from "../../../../hooks/useRecords";
import {useQueryClient} from "@tanstack/react-query";
import {notifications} from "@mantine/notifications";

export function RecordsPage() {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const queryClient = useQueryClient()

    const {mutate: uploadRecord} = useUploadRecord(() => {
        queryClient.invalidateQueries({ queryKey: ['getRecords'] })
        notifications.show({
            title: 'Запись успешно добавлена!',
            color: 'green'
        })
    }, () => {
    })

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true,
                    sampleRate: 48000
                }
            });

            const audioStream = new MediaStream();
            for (const track of stream.getAudioTracks()) {
                audioStream.addTrack(track);
            }

            for (const track of stream.getVideoTracks()) {
                track.stop();
            }

            const recorder = new MediaRecorder(audioStream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = saveAudio;

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Ошибка при захвате аудио:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const saveAudio = () => {
        console.log(audioChunksRef.current)
        const blob = new Blob(audioChunksRef.current, {type: 'audio/webm'});
        const formData = new FormData();
        const file =  new File([blob], "record.webm", {
            type: "audio/mpeg",
            lastModified: new Date().getTime()
        })
        console.log(file)
        formData.append("file", file);
        console.log(formData)
        uploadRecord(formData)
        // console.log(record)


        // const url = URL.createObjectURL(blob);
        //
        // const a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = url;
        // a.download = 'recorded-audio.webm';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        audioChunksRef.current = []; // Очистить аудио фрагменты после сохранения
    };

    console.log(audioChunksRef.current)
    const {records, isLoading} = useRecords()
    // const records = [
    //     {
    //         id: "1",
    //         name: "Название записи",
    //         date: "23 июня 2024 08:00",
    //         status: "Recorded",
    //         duration: "01:16",
    //     },
    //     {
    //         id: "2",
    //         name: "Обсуждение продолжение работы над Атом.Докой",
    //         date: "24 июня 2024 09:17",
    //         status: "Transcribing",
    //         duration: "02:49"
    //     },
    //     {
    //         id: "3",
    //         name: "Обсуждение продолжение работы над Атом.Докой",
    //         date: "24 июня 2024 09:17",
    //         status: "Transcribed",
    //         duration: "02:49"
    //     },
    //     {
    //         id: "4",
    //         name: "Обсуждение продолжение работы над Атом.Докой",
    //         date: "24 июня 2024 09:17",
    //         status: "Summarizing",
    //         duration: "02:49"
    //     },
    //     {
    //         id: "5",
    //         name: "Обсуждение продолжение работы над Атом.Докой",
    //         date: "24 июня 2024 09:17",
    //         status: "Summarized",
    //         duration: "02:49"
    //     }
    // ]

    if(isLoading)
        return <Loader/>

    return (
        <Stack className={styles.projectsPage}>
            <Container m='md' fluid gap='20px' p='xl' className={styles.recordsContainer}>
                <Stack gap="xl">
                    <Group>
                        <Select
                            clearable
                            label="Статус"
                            size="md"
                            radius="md"
                            placeholder="Выберите статус"
                            data={['Записано', 'Транскрибируется', 'Транскрибировано', 'Суммаризируется', 'Суммаризировано']}
                        />
                    </Group>
                    <Stack gap="md">
                        {
                            records.map(record => (
                                <RecordCard
                                    record={record}
                                    isSelect={selectedRecord === record.id}
                                    setSelectedRecord={setSelectedRecord}
                                />
                            ))
                        }
                    </Stack>
                </Stack>


                {/*<Button onClick={isRecording ? stopRecording : startRecording}>*/}
                {/*    {isRecording ? 'Stop Recording' : 'Start Recording'}*/}
                {/*</Button>*/}

            </Container>
            <Container
                ml='md'
                mr='md'
                pl='xl'
                pr='xl'
                fluid
                w="100%"
                className={styles.audioControlContainer}
            >
                <Paper p='lg' className={styles.audioControl}>
                    <Button.Group>
                        <ActionIcon size="xl" color="rgba(92, 95, 102, 1)">
                            <IconPlus/>
                        </ActionIcon>
                        <Tooltip label={"Записать аудио"} color="rgba(71, 71, 71, 1)" offset={10}>

                            <ActionIcon size="xl" color="red" onClick={isRecording ? stopRecording : startRecording}>
                                {
                                    isRecording ?
                                        <IconPlayerStop/> :
                                        <IconMicrophone/>
                                }
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={"Добавить аудио"} color="rgba(71, 71, 71, 1)" offset={10}>
                            <ActionIcon size="xl" color="blue" onClick={isRecording ? stopRecording : startRecording}>
                                <IconFilePlus/>
                            </ActionIcon>
                        </Tooltip>
                    </Button.Group>
                </Paper>
            </Container>
        </Stack>
    )
}
