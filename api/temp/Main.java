public class FibonacciSequence {
    
    // Method to print the Fibonacci sequence up to `n` terms
    public static void printFibonacci(int n) {
        int a = 0, b = 1;  // First two Fibonacci numbers

        System.out.print(a + " ");  // Print the first number
        for (int i = 1; i < n; i++) {
            System.out.print(b + " ");  // Print the next Fibonacci number
            int next = a + b;  // Calculate the next number in the sequence
            a = b;             // Update `a`
            b = next;          // Update `b`
        }
    }

    public static void main(String[] args) {
        int n = 10;  // Number of terms to print
        System.out.println("Fibonacci sequence up to " + n + " terms:");
        printFibonacci(n);  // Call the method to print the sequence
    }
}
