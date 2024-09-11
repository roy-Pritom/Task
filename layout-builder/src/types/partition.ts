// Define the Partition type
export type TPartition = {
    id: number;
    parentId: number | null;
    isHorizontal: boolean;
    color: string;
    width: string; 
    height: string; 
  }