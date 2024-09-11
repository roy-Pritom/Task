import { useState } from 'react';
import { NumberSize, Resizable} from 're-resizable';
import { TPartition } from './types/partition';
import { generateRandomColor } from './utils/generateRandomColor';

// The main component
const App: React.FC = () => {
  const [partitions, setPartitions] = useState<TPartition[]>([
    { id: 1, parentId: null, isHorizontal: false, color: generateRandomColor(), width: '100%', height: '100%' },
  ]);

  // Handle splitting of partitions
  const handleSplit = (id: number, type: 'V' | 'H') => {
    const isHorizontal = type === 'H';
    const parent = partitions.find(p => p.id === id);
    if (!parent) return;

    // Generate new IDs for the child partitions
    const newId1 = partitions.length + 1;
    const newId2 = partitions.length + 2;

    // Create new partitions
    const newPartitions: TPartition[] = [
      {
        id: newId1,
        parentId: id,
        isHorizontal,
        color: generateRandomColor(),
        width: '50%',
        height: '50%',
      },
      {
        id: newId2,
        parentId: id,
        isHorizontal,
        color: generateRandomColor(),
        width: '50%',
        height: '50%',
      }
    ];

    // Update the state with new partitions
    setPartitions(prev => [
      ...prev.map(partition =>
        partition.id === id ? { ...partition, isHorizontal } : partition
      ),
      ...newPartitions,
    ]);
  };

  // Handle removal of partitions
  const handleRemove = (id: number) => {
    const removePartitionAndChildren = (partitionId: number) => {
      const children = partitions.filter(p => p.parentId === partitionId);
      children.forEach(child => removePartitionAndChildren(child.id));
      setPartitions(prev => prev.filter(p => p.id !== partitionId));
    };
    removePartitionAndChildren(id);
  };

  // Snap sizes to 1/4, 1/2, 3/4 ratios
  const snapSize = (size: number, parentSize: number) => {
    const quarter = parentSize / 4;
    const half = parentSize / 2;
    const threeQuarters = (parentSize * 3) / 4;
    if (size <= quarter) return quarter;
    if (size <= half) return half;
    if (size <= threeQuarters) return threeQuarters;
    return parentSize;
  };

  // Handle resizing of partitions
  const handleResizeStop= (_e: MouseEvent | TouchEvent, _direction: string, ref: HTMLElement, _d: NumberSize, partition: TPartition) => {
    const parent = ref.parentElement!;
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    // Snap sizes
    const newWidth = snapSize(ref.offsetWidth, parentWidth);
    const newHeight = snapSize(ref.offsetHeight, parentHeight);

    // Update the partition's size based on resizing
    setPartitions(prev =>
      prev.map(p =>
        p.id === partition.id
          ? {
              ...p,
              width: `${(newWidth / parentWidth) * 100}%`,
              height: `${(newHeight / parentHeight) * 100}%`,
            }
          : p
      )
    );
  };

  // Recursive rendering of partitions
  const renderPartitions = (parentId: number | null) => {
    return partitions
      .filter(partition => partition.parentId === parentId)
      .map(partition => (
        <Resizable
          key={partition.id}
          defaultSize={{
            width: partition.width,
            height: partition.height,
          }}
          minWidth="100px"
          minHeight="100px"
          className="border overflow-hidden rounded shadow-md"
          enable={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          onResizeStop={(e, direction, ref, d) => handleResizeStop(e, direction, ref, d, partition)}
          style={{ backgroundColor: partition.color, position: 'relative' }}
        >
          <div className={`flex ${partition.isHorizontal ? 'flex-row' : 'flex-col'} w-full h-full`}>
            {renderPartitions(partition.id)}
            <div className="absolute top-2 left-2 flex gap-2">
              <button
                onClick={() => handleSplit(partition.id, 'V')}
                className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600"
              >
                V
              </button>
              <button
                onClick={() => handleSplit(partition.id, 'H')}
                className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600"
              >
                H
              </button>
              <button
                onClick={() => handleRemove(partition.id)}
                className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </Resizable>
      ));
  };

  return (
    <div className="h-screen w-full p-4 bg-gray-100">
      <div className="h-full w-full border rounded shadow-lg overflow-hidden bg-white">
        {renderPartitions(null)}
      </div>
    </div>
  );
};

export default App;



