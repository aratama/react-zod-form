"use client";

import { useState } from "react";
import * as z from "zod";

export const addressSchema = z.object({
  birthday: z.date(),
  postalCode: z.string(),
  prefecture: z.enum(["北海道", "青森県", "岩手県", "宮城県", "秋田県"]),
  city: z.string(),
  street: z.string(),
  height: z.number(),
  weight: z.number(),
});

export type Address = z.infer<typeof addressSchema>;

function ZodDateForm(props: {
  schema: z.ZodDate;
  value: Date;
  onInput: (value: Date) => unknown;
}) {
  return (
    <input
      type="datetime-local"
      value={props.value.toISOString().slice(0, 16)}
      onInput={(e) => props.onInput(new Date(e.currentTarget.value))}
    />
  );
}

function ZodNumberForm(props: {
  schema: z.ZodNumber;
  value: number;
  onInput: (value: number) => unknown;
}) {
  return (
    <input
      type="number"
      className="border text-black"
      value={props.value.toFixed(1)}
      onInput={(e) => props.onInput(parseInt(e.currentTarget.value))}
    />
  );
}

function ZodEnumForm<T extends [string, ...string[]]>(props: {
  schema: z.ZodEnum<T>;
  value: T[number];
  onInput: (value: T[number]) => unknown;
}) {
  return (
    <select>
      {Object.values(props.schema.Values).map((value) => (
        <option key={value as any} value={value as any}>
          {value as any}
        </option>
      ))}
    </select>
  );
}

function ZodStringForm(props: {
  schema: z.ZodString;
  value: string;
  onInput: (value: string) => unknown;
}) {
  return (
    <input
      className="border text-black"
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
}

function ZodObjectForm<T>(props: {
  schema: z.ZodSchema<T>;
  value: T;
  onInput: (value: T) => unknown;
}) {
  const schema: z.ZodObject<any> = props.schema as any;
  const entries: [string, z.ZodObject<any>][] = Object.entries(
    schema._def.shape()
  );
  return (
    <div>
      {entries.map(([k, v]) => {
        const typeName = (v._def as any).typeName;
        return (
          <div key={k} className="flex gap-2 w-fit">
            <div className="w-24">{k}</div>
            <div className="w-24">{typeName}</div>
            <div className="w-48">
              {typeName === "ZodString" ? (
                <ZodStringForm
                  schema={schema._def.shape()[k]}
                  value={((props.value as any)[k] as string) ?? ""}
                  onInput={(value) => {
                    props.onInput({ ...props.value, [k]: value });
                  }}
                />
              ) : typeName === "ZodEnum" ? (
                <ZodEnumForm
                  schema={schema._def.shape()[k]}
                  value={((props.value as any)[k] as string) ?? ""}
                  onInput={(value) => {
                    props.onInput({ ...props.value, [k]: value });
                  }}
                />
              ) : typeName === "ZodDate" ? (
                <ZodDateForm
                  schema={schema._def.shape()[k]}
                  value={(props.value as any)[k] as Date}
                  onInput={(value) => {
                    props.onInput({ ...props.value, [k]: value });
                  }}
                />
              ) : typeName === "ZodNumber" ? (
                <ZodNumberForm
                  schema={schema._def.shape()[k]}
                  value={(props.value as any)[k] as number}
                  onInput={(value) => {
                    props.onInput({ ...props.value, [k]: value });
                  }}
                />
              ) : (
                <div>Not implemented for {typeName}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [value, setValue] = useState<Address>({
    postalCode: "100-0000",
    prefecture: "北海道",
    city: "千代田区",
    street: "千代田12345",
    birthday: new Date("2023-05-09T00:00:00.000Z"),
    height: 170,
    weight: 70,
  });

  return (
    <main className="p-24">
      <h1 className="text-2xl mt-8 mb-2">Form</h1>
      <ZodObjectForm
        schema={addressSchema}
        value={value}
        onInput={(v) => {
          setValue(v);
        }}
      />

      <h1 className="text-2xl mt-8 mb-2">State</h1>
      <pre className="border w-fit">{JSON.stringify(value, null, 2)}</pre>
    </main>
  );
}
