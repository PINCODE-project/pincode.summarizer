import {useMutation} from "@tanstack/react-query";
import {RecordService} from "../services/record.service";

export function useTranscribe(onSuccess, onError) {
    const {data, mutate, isPending, error} = useMutation({
        mutationKey: ['transcribe'],
        mutationFn: (recordId) => RecordService.transcribe(recordId),
        select: data => data.data,
        onError: (error) => onError(error.response),
        onSuccess: (response) => {
            onSuccess(response.data)
        }
    })

    return {transcribe: data, mutate, isPending, error}
}
