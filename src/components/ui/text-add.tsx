'use client';

import { Icons } from '@/assets/icons';
import { cn } from '@/libs/common';
import React, { useEffect, useState } from 'react';
import H3 from '../text/H3';
import { HStack, VStack } from '../utilities';
import { Button } from './button';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Input } from './input';
import { Label } from './label';

type Props = {
  className?: string;
  onChange?: (data: string[]) => void;
  value?: string[];
  childMaxLength?: number;
};
const TextAdd = ({ className, childMaxLength, onChange, value }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [listText, setListText] = useState<string[]>([]);
  const [valueInput, setValueInput] = useState<string>('');

  const handleAddText = () => {
    const newListText = [...listText, valueInput];
    setListText(newListText);
    setValueInput('');
    onChange?.(newListText);
    setIsOpen(false);
  };

  const handleRemoveText = (item: string) => {
    const newListText = listText.filter((x) => x !== item);
    onChange?.(newListText);
    setListText(newListText);
  };
  const isExistText = listText?.some((x) => x === valueInput);

  useEffect(() => {
    if (!value) return;
    setListText(value);
  }, [value]);
  return (
    <div className="flex rounded-md border-[#FAFAFA26] bg-[#FAFAFA26] px-4 py-3">
      <HStack className="flex-1" spacing={16}>
        {listText?.map((item) => (
          <div key={item} className="group flex w-fit rounded-2xl border-[#2B211F] border-[1.5px] px-3 py-1 text-[#2B211F]">
            <span>{item}</span>
            <div
              onClick={() => handleRemoveText(item)}
              className="ml-2 hidden h-5 w-5 cursor-pointer rounded-full bg-[#E0384B33] hover:opacity-75 group-hover:flex"
            >
              <Icons.X className="m-auto h-4 w-4 text-amaranth-600" />
            </div>
          </div>
        ))}
      </HStack>

      <div className="flex items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center text-sm hover:opacity-70" type="button">
              Add metric title
              <Icons.plus className="ml-2" />
            </button>
          </DialogTrigger>

          <DialogContent>
            <div className="">
              <HStack pos="apart">
                <H3 className="">Add Capability</H3>

                <button onClick={() => setIsOpen(false)} className="w-7 text-tertiary-900 hover:opacity-80">
                  <Icons.X />
                </button>
              </HStack>

              <VStack className="mt-12 mb-8">
                <Label>
                  Capability <span className="text-red-500">*</span>
                </Label>

                <Input
                  autoFocus
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className={cn({
                    'border-amaranth-600 shadow-[0px_0px_0px_4px_#E0384B40] outline-amaranth-600':
                      childMaxLength && valueInput.length > childMaxLength,
                  })}
                />

                {childMaxLength && valueInput.length > childMaxLength && (
                  <p className={cn('font-medium text-[0.8rem] text-destructive', className)}>
                    Input must be a maximum of {childMaxLength} characters!
                  </p>
                )}
              </VStack>

              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={handleAddText}
                disabled={Boolean(valueInput?.length < 1 || isExistText || (childMaxLength && valueInput.length > childMaxLength))}
              >
                <Icons.save className="mr-1" />
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TextAdd;
