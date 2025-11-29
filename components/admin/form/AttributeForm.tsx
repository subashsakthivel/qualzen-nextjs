import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TagInput from "@/components/ui/taginput";
import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import { Trash2Icon } from "lucide-react";
import React from "react";



export default function AttributeForm(existingAttributes: TCategorySpecificAttributes[] | null) {
    const [attributes, setAttributes] = React.useState<TCategorySpecificAttributes[]>(existingAttributes || []);
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                      <TableHead>Allowed Values</TableHead>
                      <TableHead>Mandatory For Product</TableHead>
                      <TableHead>Mandatory For Variant</TableHead>
                      <TableHead>Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributes.map((attr, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Trash2Icon
                            className="h-3.5 w-3.5 cursor-pointer"
                            onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attr.attributeName}
                            onChange={(e) => {
                              attr.attributeName = e.target.value;
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.attributeType}
                            onValueChange={(v) => {
                              attr.attributeType =
                                v as TCategorySpecificAttributes["attributeType"];
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["text", "number", "select", "checkbox", "radio"].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TagInput
                            defaulttags={attr.allowedValues || []}
                            onTagValueChange={(tags) => {
                              if (!!attr._id) return;
                              attr.allowedValues = tags;
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.isMandatoryForProduct ? "true" : "false"}
                            onValueChange={(v) => {
                              attr.isMandatoryForProduct = v === "true";
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attr.isMandatoryForVariant ? "true" : "false"}
                            onValueChange={(v) => {
                              attr.isMandatoryForVariant = v === "true";
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={attr.sortOrder}
                            min={0}
                            onChange={(e) => {
                              attr.sortOrder = Math.round(Number(e.target.value));
                              setAttributes([...attributes]);
                            }}
                            disabled={!!attr._id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
        </div>
    );
}