import {useMutation} from "@tanstack/react-query";
import {RecordService} from "../services/record.service";

export function useUploadRecord(onSuccess, onError) {
    const {mutate, isPending, error} = useMutation({
        mutationKey: ['uploadRecord'],
        mutationFn: (id) => RecordService.uploadRecord(id),
        select: data => data.data,
        onError: (error) => onError(error.response),
        onSuccess: (response) => {
            onSuccess(response.data)
        }
    })

    return {mutate, isPending, error}
}
