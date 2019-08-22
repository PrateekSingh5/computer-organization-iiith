var sampleProgram = {

sampleProgram1: `
#Program to add two numbers

	.data
	sum: .word 0

	.text
	main:
	li $t0, 10
	li $t1, 15
	add $t2, $t0, $t1 	# compute the sum.	
	sw $t2, sum
	`,

sampleProgram2: `
#Program to convert a string to int

.data 
string: .asciiz "13245"
newline: .word 10
.text
main:

la $t0, string 			# Initialize S.
li $t2, 0 				# Initialize sum = 0.
lw $t5, newline 
sum_loop:
	 lb $t1, ($t0) 			# load the byte at addr S into $t1,
	 addu $t0, $t0, 1 		# and increment S.
	 beq $t1, $t5, end_sum_loop

	mul $t2, $t2, 10 			# t2 *= 10.

 	sub $t1, $t1, 48	 		# t1 -= '0'.
	add $t2, $t2, $t1 			# t2 += t1.

	b sum_loop # and repeat the loop.
end_sum_loop:
`,

sampleProgram3:`
#compute length of a string

.data
string: .asciiz "This is a string"
length: .word 0

.text
la $t1, string
li $t2, 0
length_loop:
	lb $t3, ($t1)
	beqz $t3, endloop
	addu $t2, $t2, 1
	addu $t1, $t1, 1
	b length_loop
endloop:
	sub $t2, $t2, 1		#subtract 1 to ignore 
	sw $t2, length
`,
}