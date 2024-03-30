import java.util.*;

import static java.lang.Math.max;

class Node <T,D>{
	T key;
	D data;
	int N;
	int h;
	Node<T,D> parent;
	Node<T,D> left, right;

	public Node(T key, D data){
		this.key = key;
		this.data = data;
		this.N = 1;
	}

	public int get_Height(){return h;}
	public void set_Height(int data){this.h = data;}
}

class AVL <T extends Comparable<T>, D>{
	protected Node<T,D> a;

	protected void relink(Node<T,D> parent, Node<T,D> child, boolean makeLeft){
		if(child != null) child.parent = parent;
		if(makeLeft) parent.left = child;
		else
			parent.right = child;
	}

	protected void set_Node(Node<T,D> x){
		Node<T,D> y = x.parent;
		Node<T,D> z = y.parent;

		if(z == null){
			a = x;
			x.parent = null;
		}
		else
			relink(z, x, y == z.left);

		if(x == y.left){
			relink(y, x.right, true);
			relink(x, y, false);
		}
		else{
			relink(y, x.left, false);
			relink(x, y, true);
		}
	}

	protected Node<T,D> restructure(Node<T,D> x){
		Node<T,D> y = x.parent;
		Node<T,D> z = y.parent;

		if((x == y.left) == (y == z.left)){
			set_Node(y);
			return y;
		}
		else{
			set_Node(x);
			set_Node(x);
			return x;
		}
	}

	private int height(Node<T,D> x){
		if(x == null)
			return 0;
		else return x.get_Height();
	}

	private void setHeight(Node<T,D> x, int height){
		x.set_Height(height);
	}

	private void checkHeight(Node<T,D> x){
		setHeight(x, 1 + max(height(x.left), height(x.right)));
	}

	private boolean checkBalanced(Node<T,D> x){
		int data = height(x.left) - height(x.right);
		if(data > 1 || data < -1)
			return false;
		else
			return true;
	}

	private Node<T,D> taller_child(Node<T,D> x){
		if(height(x.left) > height(x.right)) return x.left;
		if(height(x.left) < height(x.right)) return x.right;
		if(x == a) return x.left;
		if(x == x.parent.left) return x.left;
		else
			return x.right;
	}

	private void rebalance(Node<T,D> x){
		while(x != null){
			if(checkBalanced(x)){
				x = restructure(taller_child(taller_child(x)));
				checkHeight(x.left);
				checkHeight(x.right);

				for(Node<T,D> p = x; p != null; p = p.parent)
					checkHeight(p);
			}

			x = x.parent;
		}
	}
}


public class abc {
	public static void main(String[] args) {



	}
}



