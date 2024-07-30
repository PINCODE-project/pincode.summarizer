import {useQuery} from '@tanstack/react-query';
import {RecordService} from "../services/record.service";

export function useRecord(recordId) {
    const {data, isLoading} = useQuery({
        queryKey: ['getRecord', recordId],
        queryFn: () => RecordService.getRecord(recordId),
        select: data => data.data
    })

    return {record: data, isLoading}
}
