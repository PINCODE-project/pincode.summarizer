import {useQuery} from '@tanstack/react-query';
import {RecordService} from "../services/record.service";

export function useRecords() {
    const {data, isLoading} = useQuery({
        queryKey: ['getRecords'],
        queryFn: () => RecordService.getRecords(),
        select: data => data.data
    })

    return {records: data, isLoading}
}
