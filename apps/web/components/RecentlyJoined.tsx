import React from 'react'

export default function RecentlyJoined() {
  return (
    <div className="border-custom flex max-h-[90vh] min-h-[60vh] w-96 flex-col scroll-smooth rounded-xl border pt-2">
      <span className="flex justify-center text-lg font-semibold">
        Recent joined rooms
      </span>

      <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto px-3 py-4 text-start">
        {[
          {
            title: "Ajaoo music bjate hai",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Ajaoo music bjate hai",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Ajaoo music bjate hai",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Saturday stream join",
            code: "NAMME",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Bgmi jonthan room",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Beat pe dance",
            code: "JKXKSQ",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Music Bajaoo laundo",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Music Bajaoo laundo",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Music Bajaoo laundo",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Ajaoo music bjate hai",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Saturday stream join",
            code: "NAMME",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Ajaoo music bjate hai",
            code: "RJSXO",
            Owner: "Ashish Tiwari",
          },
          {
            title: "Saturday stream join",
            code: "NAMME",
            Owner: "Ashish Tiwari",
          },
        ].map((value, index) => (
          <div className="flex flex-col" key={index}>
            <span>{value.title}</span>
            <span className="pt-0.5 text-xs text-neutral-300">
              room id - {value.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
