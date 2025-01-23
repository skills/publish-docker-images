# Python3 program to find maximum
# in arr[] of size n
 
# python function to find maximum
# in arr[] of size n
 
 
def largest(arr, n):
 
    # Initialize maximum element
    max = arr[0]
 
    # Traverse array elements from second
    # and compare every element with
    # current max
    for i in range(1, n):
        if arr[i] > max:
            max = arr[i]
    return max
 
 
# Driver Code
arr = [10, 324, 45, 90, 9808]
n = len(arr)
Ans = largest(arr, n)
print("Largest in given array ", Ans)
Output
Largest in given array  9808
Time Complexity: O(N)
Auxiliary Space: O(1)

Find largest element in an array Using built-in function max()
Here we will use the inbuilt method max() to find the maximum of the array. Below is the implementation of the approach.




# Python3 program to find maximum
# in arr[] of size n
def largest(arr, n):
    ans = max(arr)
    return ans;
 
# Driver code
if __name__ == '__main__':
    arr = [10, 324, 45, 90, 9808]
    n = len(arr)
    print ("Largest in given array ", largest(arr, n))
