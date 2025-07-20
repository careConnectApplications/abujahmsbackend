import { NextFunction } from "express";
import HistopathologyExamForm from "../models/histopathologyExamForm";
import mongoose from "mongoose";

export async function CreateHistopatholgyTestDao(body: any, next: NextFunction) {
    try {
        const histopathologyTestForm = new HistopathologyExamForm(body);
        return await histopathologyTestForm.save();
    }
    catch (err) {
        return next(err);
    }
}

export const queryOneHistopathologyTestFilter = async (query: any, selectquery: any, populatequery: any) => await HistopathologyExamForm.findOne(query).select(selectquery).populate(populatequery);
export const queryHistopathologyTestFilter = async (query: any, selectquery: any, populatequery: any) => await HistopathologyExamForm.find(query).select(selectquery).populate(populatequery);

export const updateHistopathologyById = async (
    Id: mongoose.Types.ObjectId,
    body: any
) => {
    const updatedTestRecord = await HistopathologyExamForm.findByIdAndUpdate(
        { _id: Id }, body,
        {
            new: true,
            runValidators: true,
        }
    );

    return updatedTestRecord;
}