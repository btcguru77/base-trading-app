"use client";

import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";

export type DetailItemProps = {
  label: string;
  value: number;
};

const detailItems: DetailItemProps[] = [
  {
    label: "Price",
    value: 100,
  },
  {
    label: "6h Volume",
    value: 100,
  },
  {
    label: "6h Price Change",
    value: 100,
  },
  {
    label: "FDV",
    value: 100,
  },
];

export default function App() {
  const [selected, setSelected] = React.useState<any>("buy");

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-wrap gap-2 py-3">
        {detailItems.map((items: DetailItemProps, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div>{items.label}:</div>
            <div>{items.value}</div>
          </div>
        ))}
      </div>
      <Card className="w-[340px] max-w-full h-full">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="buy" title="Buy">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount to buy"
                  type="text"
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sell")}>
                    Sell
                  </Link>
                </p>
                <div className="flex justify-end gap-2">
                  <Button fullWidth color="primary">
                    Buy
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sell" title="Sell">
              <form className="flex flex-col gap-4 h-[300px]">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount to sell"
                  type="text"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("Buy")}>
                    Buy
                  </Link>
                </p>
                <div className="flex justify-end gap-2">
                  <Button fullWidth color="primary">
                    Sell
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
