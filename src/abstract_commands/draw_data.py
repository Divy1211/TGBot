import matplotlib.pyplot as plt
import sys
import json
import ast


def draw_data(last_changes):
    l = len(last_changes)
    plt.plot(list(range(1,l+1)), last_changes, color="red", marker="o")
    for a, b in zip(list(range(1,l+1)), last_changes):
        plt.annotate(b,  # this is the text
                     (a, b),  # these are the coordinates to position the label
                     textcoords="offset points",  # how to position the text
                     xytext=(0, 6),  # distance from text to points (x,y)
                     ha='center')  # horizontal alignment can be left, right or center
    plt.title(f'rating changes in last {l} games')
    plt.ylabel('rating change')
    plt.xticks(range(1,l+1))
    plt.grid(True)
    plt.savefig("saved_img")
#     plt.show()

input = ast.literal_eval(sys.argv[1])
print("kkk")
draw_data(input)
sys.stdout.flush()