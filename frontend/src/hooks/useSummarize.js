import {useMutation} from "@tanstack/react-query";
import {RecordService} from "../services/record.service";

export function useSummarize(onSuccess, onError) {
    const {data, mutate, isPending, error} = useMutation({
        mutationKey: ['summarize'],
        mutationFn: (recordId) => RecordService.summarize(recordId),
        select: data => data.data,
        onError: (error) => onError(error.response),
        onSuccess: (response) => {
            onSuccess(response.data)
        }
    })

    return {summarize: data, mutate, isPending, error}
}
