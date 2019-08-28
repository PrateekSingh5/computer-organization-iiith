The experiment in Java Script contains the below mentioned.

1. Introduction

This simulator is designed to run assembly codes, programed in Arm assmebly language.

2. Layout

At the top of the simulator there is a MenuBar. The Menubar provides following functionalities ..

    File

        Options for writing a new code; opening a file; closing or saving the current code etc
        Exiting the Simulator

    Edit

        Editor options like undo, redo, select all etc.

    Run

        Assemble the code
        Run the whole program
        Run the current instruction of the program



The main panel consistes of 4 tabs.

    Editor : Here the user will write their programs. The editor can have multiple tabs of code section. In each tab user can write their programs.

    Execute : Assembling and running of the user code will be done here. It consists of various sections like the register table, text section, memory table etc.

    Sample Codes : Various sample Arm Programs are provided here for the user help.
    Help : User guide to understand the simulator.



The bottom I/O panel is to generate the assembler messages. Assembly errors, runtime errors, input/output messages etc will be generated here.

3. Writing and Running a sample program

    To write a program, the first thing we have to do, is to open a new editor where we can write our program. To do that ..

        Click on the File button from the menu. A list will appear.

        Click on the New button from the list. A new editor will appear in the editor tab. Here we will write our program.

    Next, we will write our code in the editor. We can either start from scratch and write the program or we can copy the sample code, present in the sample codes tab, and modify it to our needs.

    After writing our program, we will assemble it. To do that ..

        Click on the Run buttion from the menu. A list will appear.

        Click on the Assemble button from the list.

    This will assemble our arm program and the control will be transfered from the editor window to the execute window. If there are error(s) in our program, the subsequent messages will be displayed in the bottom I/O panel.

    After the program has been successfuly assebled, we can run it. We can either choose to run the whole program in one shot, or we can run one instruction at a time. To do the, the execute panel has two buttons, Run and Step


4. Supported Directives/Instructions The registers are named from r0 to r15. r15 is the program counter (PC). r14 is the link register (lr).

In this version following directives are supported :

    .word : To define a single variable or an array. If inital value(s) is not provided, no memory space will be reserved and the variable name will be an alias to the previously defined variable.

    .space : To allocate a memory chunk of given size to a variable. A memory chunk might be composed of several words.

    .global : To define a function/label as gloal

    .arm : To specify that the following code is an arm program. It has no affect on the code functionality.

    .text : To specify the begining of the text section.

    .data : To specify the beginning of the data section.



Since this is a simulator form ARM, All the instructions and their format is in ARM assembly language. 

The functionality of every instruction is in accordance with the arm architecture. In this version, following instructions are supported :

	Load/Store : 	ldr, str

	Branch : 	b, bl

	Basic Instructions : 	Arithmetic, Logical Comparision and Data Movement instructions

	Arithmetic : 	add, adc, sub, sbc, rsb, rsc mul, mla

	Logical : 	and, eor, orr, bic

	Comparison : 	cmp, cmn, tst, teq

	Data movement : 	mov, mvn, swp, clz


The following Condition flags are supported

Flags 	Logical Instructions 	Arithmetic Instructions

Negative (N) 	No meaning 	Set if the result of the signed operation is negative

Zero (Z) 	Set if the result is all zeros 	Set if the result of the operation is zero

Carry (C) 	Set if after 'shift' operation, 1 was left in the carry flag. 	Set if the result was greater than 32 bits

Overflow (O) 	No meaning 	Set if the result of the signed operation led to overflow.



The instructions may have a condition field set. The following conditions are supported.

EQ 	NE 	HS / CS 	LO / CC

MI 	PL 	VS 	VC

HI 	LS 	GE 	LT

GT 	LE 	AL 	NV


For the basic instructions, the flag variable will be modified only when the instruction is followed by 'S' condition.

--> To add comments use, @ or ;, followed by your comment.

--> In text section, Constants must be preceded by a #. For example, to assign 10 to r1, use: mov r1, #10 (or mov r1, #0xa) 


My project uses the assembler framework 
[Keystone](https://github.com/keystone-engine/keystone) and the CPU emulator framework 
[Unicorn](https://github.com/unicorn-engine/unicorn) which are both licensed under the GPLv2 license.

