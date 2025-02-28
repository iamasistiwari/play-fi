import React from 'react'
import Input from './ui/Input'

import { Plus } from 'lucide-react'
import CustomButton from './ui/CustomButton';

export default function RoomInput() {
  return (
    <div>
      <form className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="createRoom">Create room</label>
          <CustomButton
            id="createRoom"
            className="max-w-sm"
            isLoading={false}
            Icon={Plus}
          >
            Create room
          </CustomButton>
        </div>
        <div className="flex flex-col">
          <label htmlFor="joinRoom">Join room</label>
          <div>
            <Input id="joinRoom" placeholder="enter room id" />
            <CustomButton variant={'ghost'} className="w-52" isLoading={false} Icon={null}>
              Join
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
