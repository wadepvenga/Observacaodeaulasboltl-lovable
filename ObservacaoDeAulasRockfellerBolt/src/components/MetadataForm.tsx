import React from 'react';
import { ClassMetadata, Method } from '../types';

interface MetadataFormProps {
  metadata: ClassMetadata;
  onMetadataChange: (metadata: ClassMetadata) => void;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({
  metadata,
  onMetadataChange,
}) => {
  const methods: Method[] = ['Kids', 'Teens', 'Adults'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onMetadataChange({
      ...metadata,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="input-label">Teaching Method</label>
        <select
          name="method"
          value={metadata.method}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200
            focus:ring-2 focus:ring-rockfeller-blue-primary/20 focus:border-rockfeller-blue-primary"
        >
          {methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="input-label">Book Name</label>
        <input
          type="text"
          name="book"
          value={metadata.book}
          onChange={handleChange}
          placeholder="e.g., INSIGHT, ROCKET 1"
          className="mt-1 block w-full rounded-lg"
        />
      </div>

      <div>
        <label className="input-label">Lesson Number</label>
        <input
          type="text"
          name="lesson"
          value={metadata.lesson}
          onChange={handleChange}
          placeholder="e.g., Lesson 3A"
          className="mt-1 block w-full rounded-lg"
        />
      </div>

      <div>
        <label className="input-label">Teacher Name</label>
        <input
          type="text"
          name="teacherName"
          value={metadata.teacherName}
          onChange={handleChange}
          placeholder="Enter teacher's name"
          className="mt-1 block w-full rounded-lg"
        />
      </div>
    </div>
  );
};